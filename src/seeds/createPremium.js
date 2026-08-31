import "dotenv/config";
import { AppDataSource } from "../../data-source.js";
import { UserEntity } from "../entities/User.js";
import bcrypt from "bcrypt";

await AppDataSource.initialize();

const userRepo = AppDataSource.getRepository(UserEntity);

const premiumExists = await userRepo.findOne({
    where: { email: process.env.PREMIUM_EMAIL }
});

if (premiumExists) {
    console.log("User Premium já existe já existe!");
} else {
    await userRepo.save({
        name: process.env.PREMIUM_NAME,
        email: process.env.PREMIUM_EMAIL,
        password_hash: await bcrypt.hash(process.env.PREMIUM_PASSWORD, 10),
        role: "premium",
    });
    console.log("User Premium criado com sucesso!");
}

await AppDataSource.destroy();