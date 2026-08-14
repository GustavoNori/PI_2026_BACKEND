import { AppDataSource } from "../../data-source.js";
import { NoticeEntity } from "../entities/Notice.js";

export class NoticeController {
    async getAllNotices(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const notices = await noticeRepo.find({ relations: ["area", "state"] });
            return res.json(notices);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getNoticeById(req, res) {
        try {
            const noticeRepo = AppDataSource.getRepository(NoticeEntity);
            const { id } = req.params;
            const notice = await noticeRepo.findOne({ where: { id: parseInt(id) }, relations: ["area", "state"] });

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
            const notices = await noticeRepo.find({ where: { area: { id: parseInt(areaId) } }, relations: ["area", "state"] });
            
            if (!notices || notices.length === 0) {
                return res.status(404).json({ message: "No notices found for this area" });
            }

            return res.json(notices);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}