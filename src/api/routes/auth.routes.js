import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;