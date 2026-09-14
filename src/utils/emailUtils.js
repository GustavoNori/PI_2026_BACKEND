import { Resend } from "resend";
import { AppDataSource } from "../../data-source.js";
import { UserTokenEntity } from "../entities/UserToken.js";
import { generateRandomToken } from "./tokenUtils.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Ponte do Edital <naoresponda@pontedoedital.com.br>";

export async function sendNoticeReminder(userEmail, notice) {
    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Lembrete: ${notice.title} está próximo da data`,
        html: `
            <p>Olá!</p>
            <p>A publicação <strong>${notice.title}</strong> que você favoritou está com uma data se aproximando.</p>
            <p><a href="${notice.link}">Ver publicação</a></p>
        `,
    });

    if (error) {
        throw new Error(`Falha ao enviar e-mail de lembrete: ${error.message}`);
    }
}

export async function sendForgotPasswordEmail(userEmail, token) {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: "Recuperação de Senha",
        html: `
            <p>Olá,</p>
            <p>Você solicitou a recuperação da sua senha.</p>
            <p>Clique no link abaixo para cadastrar uma nova senha (válido por 2 horas):</p>
            <p><a href="${resetUrl}">Redefinir Senha</a></p>
            <p>Se você não solicitou a alteração, ignore este e-mail.</p>
        `,
    });

    if (error) {
        throw new Error(`Falha ao enviar e-mail de recuperação: ${error.message}`);
    }
}

export async function sendEmailVerificationEmail(userEmail, token) {
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;
    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: "Verificação de E-mail",
        html: `
            <p>Olá,</p>
            <p>Obrigado por se registrar. Por favor, verifique seu e-mail clicando no link abaixo:</p>
            <p><a href="${verificationUrl}">Verificar E-mail</a></p>
            <p>Se você não se registrou, ignore este e-mail.</p>
        `,
    });

    if (error) {
        throw new Error(`Falha ao enviar e-mail de verificação: ${error.message}`);
    }
}

export async function createEmailVerificationToken(userId) {
    const tokenRepo = AppDataSource.getRepository(UserTokenEntity);

    await tokenRepo.update(
        { user_id: userId, type: "EMAIL_VERIFICATION", used: false },
        { used: true }
    );

    const token = generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newToken = tokenRepo.create({
        token,
        type: "EMAIL_VERIFICATION",
        user_id: userId,
        expires_at: expiresAt,
        used: false,
    });

    return tokenRepo.save(newToken);
}