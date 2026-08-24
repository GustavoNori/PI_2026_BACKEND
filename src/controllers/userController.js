import { AppDataSource } from "../../data-source.js";
import { UserEntity } from "../entities/User.js";
import { SubscriptionEntity } from "../entities/Subscription.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/hash.js";
import { sendForgotPasswordEmail } from "../utils/emailUtils.js";
import { UserTokenEntity } from "../entities/UserToken.js";
import { generateRandomToken } from "../utils/tokenUtils.js";

export class AuthController {
  async getAllUsers(req, res) {
    const repo = AppDataSource.getRepository(UserEntity);
    const users = await repo.find();
    return res.json(users);
  }

  async login(req, res) {
    try {
      const repo = AppDataSource.getRepository(UserEntity);

      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res
          .status(400)
          .json({ message: "Identifier and password are required" });
      }

      const user = await repo.findOne({
        where: [{ name: identifier }, { email: identifier }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = generateToken(user);

      return res.json({
        message: "Login realizado",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUser(req, res) {
    try {
      const repo = AppDataSource.getRepository(UserEntity);
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Nome, email e senha são obrigatórios" });
      }

      const existingUser = await repo.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await hashPassword(password);
      const user = repo.create({
        name,
        email,
        password_hash: hashedPassword,
        role: "user",
      });
      await repo.save(user);

      return res.status(201).json({ message: "User created" });
    } catch (error) {
      if (
        error.driverError?.code === "ER_DUP_ENTRY" ||
        error.code === "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  async getOneUser(req, res) {
    const repo = AppDataSource.getRepository(UserEntity);

    const { id } = req.params;

    const user = await repo.findOne({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  }

  async updateUser(req, res) {
    const repo = AppDataSource.getRepository(UserEntity);

    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const hashedPassword = await hashPassword(password);

    const userToUpdate = await repo.findOneBy({ id: parseInt(id) });

    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;

    if (password) {
      userToUpdate.password_hash = await hashPassword(password);
    }
    await repo.save(userToUpdate);

    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  }

  async deleteUser(req, res) {
    const repo = AppDataSource.getRepository(UserEntity);

    const { id } = req.params;

    const userToDelete = await repo.findOneBy({ id: parseInt(id) });

    if (!userToDelete) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await repo.remove(userToDelete);

    return res.status(200).json({ message: "Usuário removido com sucesso" });
  }

  async getUserByEmail(req, res) {
    const repo = AppDataSource.getRepository(UserEntity);

    const { email } = req.params;

    const user = await repo.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  }

  async promoteToAdmin(req, res) {
    try {
      const repo = AppDataSource.getRepository(UserEntity);
      const { id } = req.params;

      const user = await repo.findOneBy({ id: parseInt(id) });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = "admin";
      await repo.save(user);

      return res
        .status(200)
        .json({ message: "User promoted to admin successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async demoteToUser(req, res) {
    try {
      const repo = AppDataSource.getRepository(UserEntity);
      const { id } = req.params;

      const user = await repo.findOneBy({ id: parseInt(id) });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = "user";
      await repo.save(user);

      return res
        .status(200)
        .json({ message: "User demoted to user successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserSubscription(req, res) {
    try {
      const repo = AppDataSource.getRepository(SubscriptionEntity);
      const { id } = req.params;

      const subscription = await repo.findOne({
        where: {
          user_id: parseInt(id),
          status: "active",
        },
      });

      if (!subscription) {
        return res.json({ hasPremium: false, plan: "free" });
      }

      const endDate = new Date(subscription.end_date);
      const now = new Date();

      if (endDate < now) {
        return res.json({ hasPremium: false, plan: "free" });
      }

      return res.json({ hasPremium: true, plan: subscription.plan });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async activatePremium(req, res) {
    try {
      const repo = AppDataSource.getRepository(SubscriptionEntity);
      const { id } = req.params;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const subscription = repo.create({
        plan: "premium",
        status: "active",
        start_date: startDate,
        end_date: endDate,
        user_id: parseInt(id),
      });

      await repo.save(subscription);

      return res.status(201).json({ message: "Premium ativado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deactivatePremium(req, res) {
    try {
      const repo = AppDataSource.getRepository(SubscriptionEntity);
      const { id } = req.params;

      const subscription = await repo.findOne({
        where: {
          user_id: parseInt(id),
          status: "active",
        },
      });

      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      } else {
        subscription.status = "inactive";
        await repo.save(subscription);
        return res
          .status(200)
          .json({ message: "Premium desativado com sucesso" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "O e-mail é obrigatório" });
      }

      const repo = AppDataSource.getRepository(UserEntity);
      const tokenRepo = AppDataSource.getRepository(UserTokenEntity);

      const user = await repo.findOne({ where: { email } });

      if (!user) {
        return res
          .status(200)
          .json({
            message:
              "Se o e-mail estiver cadastrado, você recebdsgsdgerá um link para redefinir a senha.",
          });
      }

      await tokenRepo.update({ user_id: user.id, used: false }, { used: true });
      const token = generateRandomToken();

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2);

      const newToken = tokenRepo.create({
        token,
        user_id: user.id,
        expires_at: expiresAt,
        used: false,
      });

      await tokenRepo.save(newToken);

      await sendForgotPasswordEmail(user.email, token);

      return res
        .status(200)
        .json({
          message:
            "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ message: "Token e nova senha são obrigatórios" });
      }

      const tokenRepo = AppDataSource.getRepository(UserTokenEntity);
      const userRepo = AppDataSource.getRepository(UserEntity);

      const userToken = await tokenRepo.findOne({
        where: { token, used: false },
      });

      if (!userToken) {
        return res
          .status(400)
          .json({ message: "Token inválido ou já utilizado" });
      }

      const now = new Date();
      if (now > new Date(userToken.expires_at)) {
        return res
          .status(400)
          .json({ message: "Token expirado, solicite uma nova recuperação" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await userRepo.update(
        { id: userToken.user_id },
        {
          password_hash: hashedPassword,
        },
      );

      userToken.used = true;
      await tokenRepo.save(userToken);

      return res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
}
