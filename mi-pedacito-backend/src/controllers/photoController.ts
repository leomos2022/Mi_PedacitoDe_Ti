import { Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Photo from '../models/Photo';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir foto
export const uploadPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { caption, mealType, category, isMemory, scheduledDate } = req.body;

    if (!req.file) {
      res.status(400).json({ error: 'No se proporcionó imagen' });
      return;
    }

    let imageUrl: string;
    let thumbnailUrl: string;

    // Si Cloudinary está configurado, usarlo. Si no, usar almacenamiento local
    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

    if (useCloudinary) {
      // Subir a Cloudinary con optimización
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'mi-pedacito/photos',
        quality: 70,
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
      });

      // Crear thumbnail
      const thumbnailResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'mi-pedacito/thumbnails',
        quality: 50,
        transformation: [{ width: 300, height: 300, crop: 'fill' }],
      });

      imageUrl = result.secure_url;
      thumbnailUrl = thumbnailResult.secure_url;
      
      // Eliminar archivo temporal
      fs.unlinkSync(req.file.path);
    } else {
      // Usar almacenamiento local
      const baseUrl = process.env.FRONTEND_URL?.replace('3000', '5001') || 'http://localhost:5001';
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      thumbnailUrl = imageUrl; // Por simplicidad, usar la misma imagen
    }

    // Guardar en DB
    const photo = new Photo({
      userId,
      imageUrl,
      thumbnailUrl,
      caption: caption || '',
      mealType: mealType || 'other',
      category: category || 'general',
      isMemory: isMemory === 'true',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
    });

    await photo.save();

    res.status(201).json({
      message: 'Foto subida exitosamente',
      photo,
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ error: 'Error al subir foto' });
  }
};

// Obtener todas las fotos
export const getAllPhotos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const photos = await Photo.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('userId', 'username profilePhoto');

    const total = await Photo.countDocuments();

    res.json({
      photos,
      total,
      hasMore: Number(skip) + photos.length < total,
    });
  } catch (error) {
    console.error('Error al obtener fotos:', error);
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};

// Obtener fotos de Memory Lane (programadas para hoy)
export const getMemoryLane = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const memories = await Photo.find({
      isMemory: true,
      scheduledDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .sort({ scheduledDate: 1 })
      .populate('userId', 'username profilePhoto');

    res.json({ memories });
  } catch (error) {
    console.error('Error al obtener Memory Lane:', error);
    res.status(500).json({ error: 'Error al obtener memorias' });
  }
};

// Eliminar foto
export const deletePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { photoId } = req.params;

    const photo = await Photo.findById(photoId);

    if (!photo) {
      res.status(404).json({ error: 'Foto no encontrada' });
      return;
    }

    // Verificar que el usuario sea el dueño
    if (photo.userId.toString() !== userId) {
      res.status(403).json({ error: 'No autorizado para eliminar esta foto' });
      return;
    }

    // Eliminar de Cloudinary
    const publicId = photo.imageUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`mi-pedacito/photos/${publicId}`);
    }

    await Photo.findByIdAndDelete(photoId);

    res.json({ message: 'Foto eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({ error: 'Error al eliminar foto' });
  }
};

// Obtener fotos por tipo de comida
export const getPhotosByMealType = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mealType } = req.params;

    const photos = await Photo.find({ mealType })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username profilePhoto');

    res.json({ photos });
  } catch (error) {
    console.error('Error al obtener fotos por tipo de comida:', error);
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};

// Obtener fotos por categoría
export const getPhotosByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    const photos = await Photo.find({ category })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username profilePhoto');

    res.json({ photos });
  } catch (error) {
    console.error('Error al obtener fotos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};
