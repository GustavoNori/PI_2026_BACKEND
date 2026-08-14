import { DoubtAnswerController } from "../Controllers/doubtAnswerController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";

const doubtAnswerController = new DoubtAnswerController();
const doubtAnswerRouter = express.Router();

doubtAnswerRouter.post("/doubts/:doubt_id/answers", authMiddleware, doubtAnswerController.createDoubtAnswer);
doubtAnswerRouter.get("/doubts/:doubt_id/answers", doubtAnswerController.getAllDoubtAnswers);
doubtAnswerRouter.get("/doubts/:doubt_id/answers/:id", doubtAnswerController.getDoubtAnswerById);
doubtAnswerRouter.delete("/doubts/:doubt_id/answers/:id", authMiddleware, doubtAnswerController.deleteDoubtAnswer);
doubtAnswerRouter.put("/doubts/:doubt_id/answers/:id", authMiddleware, doubtAnswerController.updateDoubtAnswer);

export default doubtAnswerRouter;