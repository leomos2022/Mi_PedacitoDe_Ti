import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generar token JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '30d', // Token válido por 30 días para comodidad
  });
};

// Registro de usuario (máximo 2 usuarios)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, timezone, location } = req.body;

    // Validar que no hay más de 2 usuarios
    const userCount = await User.countDocuments();
    if (userCount >= 2) {
      res.status(403).json({ error: 'La aplicación solo permite 2 usuarios' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ error: 'Usuario o email ya existe' });
      return;
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = new User({
      username,
      email,
      password: hashedPassword,
      timezone: timezone || 'America/Chicago',
      location: location || { lat: 0, lng: 0 },
    });

    await user.save();

    // Generar token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        timezone: user.timezone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        timezone: user.timezone,
        location: user.location,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario actual
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar ubicación del usuario
export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { lat, lng, timezone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: { lat, lng },
        ...(timezone && { timezone }),
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Ubicación actualizada', user });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
};

// Obtener el otro usuario (pareja)
export const getPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const partner = await User.findOne({ _id: { $ne: userId } }).select('-password');
    if (!partner) {
      res.status(404).json({ error: 'Pareja no encontrada' });
      return;
    }

    res.json({ partner });
  } catch (error) {
    console.error('Error al obtener pareja:', error);
    res.status(500).json({ error: 'Error al obtener pareja' });
  }
};
