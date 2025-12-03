import { Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import VoiceMessage from '../models/VoiceMessage';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';

// Subir mensaje de voz
export const uploadVoiceMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { duration } = req.body;

    if (!req.file) {
      res.status(400).json({ error: 'No se proporcionó archivo de audio' });
      return;
    }

    // Subir a Cloudinary (optimizado para audio)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mi-pedacito/voice',
      resource_type: 'video', // Cloudinary usa 'video' para audio
      format: 'mp3',
    });

    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    // Guardar en DB
    const voiceMessage = new VoiceMessage({
      userId,
      audioUrl: result.secure_url,
      duration: Number(duration) || 0,
    });

    await voiceMessage.save();

    res.status(201).json({
      message: 'Mensaje de voz subido exitosamente',
      voiceMessage,
    });
  } catch (error) {
    console.error('Error al subir mensaje de voz:', error);
    res.status(500).json({ error: 'Error al subir mensaje de voz' });
  }
};

// Obtener todos los mensajes de voz
export const getAllVoiceMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const messages = await VoiceMessage.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('userId', 'username profilePhoto');

    const total = await VoiceMessage.countDocuments();

    res.json({
      messages,
      total,
      hasMore: Number(skip) + messages.length < total,
    });
  } catch (error) {
    console.error('Error al obtener mensajes de voz:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Marcar mensaje como reproducido
export const markAsPlayed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    const message = await VoiceMessage.findByIdAndUpdate(
      messageId,
      { isPlayed: true },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }

    res.json({ message: 'Mensaje marcado como reproducido', voiceMessage: message });
  } catch (error) {
    console.error('Error al marcar mensaje:', error);
    res.status(500).json({ error: 'Error al marcar mensaje' });
  }
};

// Eliminar mensaje de voz
export const deleteVoiceMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { messageId } = req.params;

    const message = await VoiceMessage.findById(messageId);

    if (!message) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }

    // Verificar que el usuario sea el dueño
    if (message.userId.toString() !== userId) {
      res.status(403).json({ error: 'No autorizado para eliminar este mensaje' });
      return;
    }

    // Eliminar de Cloudinary
    const publicId = message.audioUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`mi-pedacito/voice/${publicId}`, {
        resource_type: 'video',
      });
    }

    await VoiceMessage.findByIdAndDelete(messageId);

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
};

// Obtener mensajes no reproducidos
export const getUnplayedMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // Obtener mensajes de la pareja que no han sido reproducidos
    const messages = await VoiceMessage.find({
      userId: { $ne: userId }, // Mensajes que NO son del usuario actual
      isPlayed: false,
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePhoto');

    res.json({ messages, count: messages.length });
  } catch (error) {
    console.error('Error al obtener mensajes no reproducidos:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};
