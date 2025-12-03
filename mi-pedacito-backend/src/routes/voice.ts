import express from 'express';
import * as voiceController from '../controllers/voiceController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Subir mensaje de voz
router.post('/upload', upload.single('voice'), voiceController.uploadVoiceMessage);

// Obtener mensajes
router.get('/', voiceController.getAllVoiceMessages);
router.get('/unplayed', voiceController.getUnplayedMessages);

// Marcar como reproducido
router.put('/:messageId/played', voiceController.markAsPlayed);

// Eliminar mensaje
router.delete('/:messageId', voiceController.deleteVoiceMessage);

export default router;
