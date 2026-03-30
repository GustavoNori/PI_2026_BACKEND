import 'dotenv/config';
import express from 'express';
import userRoutes from './Routes/userRoutes.js'

const app = express()

app.use(express.json())

app.use(userRoutes);

app.get('/', (req, res) => {
  res.send('API rodando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado em: http://localhost:${PORT}`);
});