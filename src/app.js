import express from "express";
import router from "./routes/userRoutes.js";
import doubtRouter from "./routes/doubtRoute.js";
import doubtAnswerRouter from "./routes/doubtAnswerRoute.js";

const app = express();

app.use(express.json());

app.use(router);
app.use(doubtRouter);
app.use(doubtAnswerRouter);

export default app;