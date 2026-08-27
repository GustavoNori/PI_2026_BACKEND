import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendNoticeReminder(userEmail, notice) {
    await transporter.sendMail({
        from: `"Seu Site" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `Lembrete: ${notice.title} está próximo da data`,
        html: `
            <p>Olá!</p>
            <p>A publicação <strong>${notice.title}</strong> que você favoritou está com uma data se aproximando.</p>
            <p><a href="${notice.link}">Ver publicação</a></p>
        `,
    });
}
export async function sendForgotPasswordEmail(userEmail, token) {
   
    const resetUrl = `${process.env.FRONTEND_URL}?token=${token}´  || ´"http://localhost:3000"}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: `"Seu Site" <${process.env.SMTP_USER}>`,
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
}