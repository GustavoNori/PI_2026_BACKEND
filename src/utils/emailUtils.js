import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
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