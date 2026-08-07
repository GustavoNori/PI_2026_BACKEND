import { AppDataSource } from "../data-source.js"; 
import app from "./app.js"; 
import { startFavoriteNotificationJob } from "./jobs/notifyFavorites.js";

AppDataSource.initialize()
    .then(() => {
        console.log("Banco conectado");

        startFavoriteNotificationJob();
        console.log("Job de notificações iniciado");

        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000");
        });
    })
    .catch((error) => console.log("Erro:", error));