import { AppDataSource } from "../../data-source.js";
import { NotificationEntity } from "../entities/Notification.js";

class NotificationController {
    async list(req, res) {
        try {
            const notifications = await AppDataSource.getRepository(NotificationEntity).find({
                where: { user_id: req.user.id },
                relations: ["notice"],
                order: { created_at: "DESC" },
                take: 50,
            });

            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    async markRead(req, res) {
        try {
            const notification = await AppDataSource.getRepository(NotificationEntity).findOne({
                where: { id: parseInt(req.params.id, 10), user_id: req.user.id },
            });

            if (!notification) {
                return res.status(404).json({ message: "Notificação não encontrada" });
            }

            if (!notification.is_read) {
                notification.is_read = true;
                await AppDataSource.getRepository(NotificationEntity).save(notification);
            }

            return res.status(200).json({ message: "Notificação marcada como lida", notification });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    async markAllRead(req, res) {
        try {
            await AppDataSource.getRepository(NotificationEntity).update(
                { user_id: req.user.id, is_read: false },
                { is_read: true }
            );

            return res.status(200).json({ message: "Todas as notificações foram marcadas como lidas" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }
}

export default new NotificationController();
