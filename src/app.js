import express from "express";
import router from "./routes/userRoutes.js";
import doubtRouter from "./routes/doubtRoute.js";
import doubtAnswerRouter from "./routes/doubtAnswerRoute.js";
import favoriteRouter from "./routes/favoriteRoute.js";
import questionRouter from "./routes/questionRoute.js";
import simulationRouter from "./routes/simulationRoute.js";
import attemptRouter from "./Routes/simulationAttemptRoute.js";

const app = express();

app.use(express.json());

app.use(router);
app.use(doubtRouter);
app.use(doubtAnswerRouter);
app.use(favoriteRouter);
app.use(questionRouter);
app.use(simulationRouter);
app.use(attemptRouter);

export default app;