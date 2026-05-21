import { DoubtAnswerController } from "../Controllers/doubtAnswerController";
import express from "express";
import { authMiddleware } from "../utils/auth.js";

const doubtAnswerController = new DoubtAnswerController();
const doubtAnswerRouter = express.Router();

doubtAnswerRouter.post("/doubt-answers", authMiddleware, doubtAnswerController.createDoubtAnswer);
doubtAnswerRouter.get("/doubt-answers", doubtAnswerController.getAllDoubtAnswers);
doubtAnswerRouter.get("/doubt-answers/:id", doubtAnswerController.getDoubtAnswerById);
doubtAnswerRouter.delete("/doubt-answers/:id", authMiddleware, doubtAnswerController.deleteDoubtAnswer);

export default doubtAnswerRouter;