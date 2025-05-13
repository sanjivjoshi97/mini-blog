import express from 'express';
import { registerUser, loginUser, userProfile } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../middlewares/validation.middleware.js';
import { validateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile/:id', validateToken, userProfile);

export default router;