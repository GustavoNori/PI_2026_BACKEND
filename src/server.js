import { AppDataSource } from "./data-source.js"; 
import app from "./src/app.js"; 

AppDataSource.initialize()
    .then(() => {
        console.log("Banco conectado");

        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000");
        });
    })
    .catch((error) => console.log("Erro:", error));