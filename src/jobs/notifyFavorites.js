import cron from "node-cron";
import { AppDataSource } from "../../data-source.js";
import { sendNoticeReminder } from "../utils/emailUtils.js";

function formatDate(date) {
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function startFavoriteNotificationJob() {
    cron.schedule("0 8 * * *", async () => {
        const favoriteRepository = AppDataSource.getRepository("Favorite");

        const today = new Date();
        const limit = new Date();
        limit.setDate(today.getDate() + 7);

        const todayStr = formatDate(today);
        const limitStr = formatDate(limit);

        const upcomingFavorites = await favoriteRepository
            .createQueryBuilder("favorite")
            .innerJoinAndSelect("favorite.notice", "notice")
            .innerJoinAndSelect("favorite.user", "user")
            .where("notice.publication_date BETWEEN :today AND :limit", { today: todayStr, limit: limitStr })
            .getMany();

        console.log(`Encontrados ${upcomingFavorites.length} favoritos dentro da janela de 7 dias`);

        for (const favorite of upcomingFavorites) {
            try {
                await sendNoticeReminder(favorite.user.email, favorite.notice);
                console.log(`E-mail enviado para ${favorite.user.email} sobre "${favorite.notice.title}"`);
            } catch (err) {
                console.error(`Erro ao notificar favorite ${favorite.id}:`, err);
            }
        }
    });
}