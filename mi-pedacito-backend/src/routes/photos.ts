import express from 'express';
import * as photoController from '../controllers/photoController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Subir foto
router.post('/upload', upload.single('photo'), photoController.uploadPhoto);

// Obtener fotos
router.get('/', photoController.getAllPhotos);
router.get('/memory-lane', photoController.getMemoryLane);
router.get('/meal/:mealType', photoController.getPhotosByMealType);
router.get('/category/:category', photoController.getPhotosByCategory);

// Eliminar foto
router.delete('/:photoId', photoController.deletePhoto);

export default router;
