import { AppDataSource } from "../../data-source.js";
import { NoticeEntity } from "../entities/Notice.js";
import { UserEntity } from "../entities/User.js";

export class NoticeController {
    async getAllNotices(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const notices = await noticeRepo.find();
            const userRepo = AppDataSource.getRepository(UserEntity);
            const {userId} = req.params;
            const user = await userRepo.findOne({ where: { id: userId } });


            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const userRole = user.role;

            if (userRole === "user" && notices.length > 5) {
                const limitedNotices = notices.slice(0, 5);
                return res.json(limitedNotices);
            }else{
                return res.json(notices);
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getNoticeById(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const { id } = req.params;
            const notice = await noticeRepo.findOne({ where: { id: parseInt(id) } });

            if (!notice) {
                return res.status(404).json({ message: "Notice not found" });
            }

            return res.json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    async getNoticesByArea(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const { areaId } = req.params;
            const notices = await noticeRepo.find({ where: { area_id: parseInt(areaId) } });
            
            if (!notices || notices.length === 0) {
                return res.status(404).json({ message: "No notices found for this area" });
            }

            return res.json(notices);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async updateNotice(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const { id } = req.params;
            const { title, state_code, description, state, link, publication_date, created_at } = req.body;
            const notice = await noticeRepo.findOne({ where: { id: parseInt(id) } });

            if (!notice) {
                return res.status(404).json({ message: "Notice not found" });
            }

            notice.title = title;
            notice.state_code = state_code;
            notice.description = description;
            notice.state = state;
            notice.link = link;
            notice.publication_date = publication_date;
            notice.created_at = created_at;

            await noticeRepo.save(notice);
            return res.json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async deleteNotice(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const { id } = req.params;
            const notice = await noticeRepo.findOne({ where: { id: parseInt(id) } });

            if (!notice) {
                return res.status(404).json({ message: "Notice not found" });
            }

            await noticeRepo.remove(notice);
            return res.json({ message: "Notice deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
