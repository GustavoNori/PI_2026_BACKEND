import express from 'express';
import { register, login } from '../Controllers/userController.js';

const router = express.Router();

router.get('/register', register);
router.post('/login', login);

export default router;