import "dotenv/config";
import { AppDataSource } from "../../data-source.js";
import { UserEntity } from "../entities/User.js";
import bcrypt from "bcrypt";

await AppDataSource.initialize();

const userRepo = AppDataSource.getRepository(UserEntity);

const adminExists = await userRepo.findOne({
    where: { email: process.env.ADMIN_EMAIL }
});

if (adminExists) {
    console.log("Admin já existe!");
} else {
    await userRepo.save({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password_hash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        role: "admin",
    });
    console.log("Admin criado com sucesso!");
}

await AppDataSource.destroy();