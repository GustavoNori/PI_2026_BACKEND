import { Router } from "express";
import { NoticeController } from "../controllers/noticeController.js";

const router = Router();
const noticeController = new NoticeController();

router.get("/", (req, res) => noticeController.getAllNotices(req, res));
router.get("/area/:areaId", (req, res) => noticeController.getNoticesByArea(req, res));
router.get("/:id", (req, res) => noticeController.getNoticeById(req, res));

export default router;