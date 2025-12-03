import express from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/location', authMiddleware, authController.updateLocation);
router.get('/partner', authMiddleware, authController.getPartner);

export default router;
