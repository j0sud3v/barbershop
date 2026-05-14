import express from 'express';
import { sendCode, verifyCode, login, me, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-code', sendCode);

router.post('/verify-code', verifyCode);

router.post('/login', login);

router.get('/me', me);

router.post('/logout', logout);

export default router;