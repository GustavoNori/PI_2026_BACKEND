import cron from "node-cron";
import { AppDataSource } from "../../data-source.js";
import { sendNoticeReminder } from "../utils/emailUtils.js";
import { NOTIFICATION_OPTIONS } from "../utils/notificationOptions.js";

const TIMEZONE = "America/Sao_Paulo";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function dateInSaoPaulo(offsetDays) {
    const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(date);
}

export async function runFavoriteNotifications() {
    const favoriteRepository = AppDataSource.getRepository("Favorite");

    const dateToDays = {};
    for (const days of NOTIFICATION_OPTIONS) {
        dateToDays[dateInSaoPaulo(days)] = days;
    }
    const targetDates = Object.keys(dateToDays);

    const favorites = await favoriteRepository
        .createQueryBuilder("favorite")
        .innerJoinAndSelect("favorite.notice", "notice")
        .innerJoinAndSelect("favorite.user", "user")
        .where("notice.deadline_date IN (:...targetDates)", { targetDates }) // troque pelo nome real da coluna do prazo
        .andWhere("user.active = :active", { active: true })
        .andWhere("user.email_verified = :verified", { verified: true })
        .getMany();

    console.log(`Encontrados ${favorites.length} favoritos com prazo em datas de aviso`);

    for (const favorite of favorites) {
        const deadline = String(favorite.notice.deadline_date).slice(0, 10); // mesmo nome da coluna
        const daysLeft = dateToDays[deadline];
        if (daysLeft === undefined) continue;

        const chosen = favorite.user.notification_days;
        if (chosen !== null && chosen !== undefined && !chosen.map(Number).includes(daysLeft)) {
            continue;
        }

        try {
            await sendNoticeReminder(favorite.user.email, favorite.notice, daysLeft);
            console.log(`Aviso (${daysLeft} dias) enviado para ${favorite.user.email}: "${favorite.notice.title}"`);
        } catch (err) {
            console.error(`Erro ao notificar favorite ${favorite.id}:`, err);
        }

        await sleep(600); // respeita o limite de requisições do Resend
    }
}

export function startFavoriteNotificationJob() {
    cron.schedule("0 8 * * *", runFavoriteNotifications, { timezone: TIMEZONE });
}