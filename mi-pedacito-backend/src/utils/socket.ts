import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import ConnectionLog from '../models/ConnectionLog';

interface ConnectedUser {
  userId: string;
  socketId: string;
  username: string;
}

const connectedUsers = new Map<string, ConnectedUser>();

export const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔌 Usuario conectado:', socket.id);

    // Usuario se une con su ID
    socket.on('join', async (data: { userId: string; username: string }) => {
      try {
        const { userId, username } = data;

        // Guardar usuario conectado
        connectedUsers.set(userId, {
          userId,
          socketId: socket.id,
          username,
        });

        socket.join(userId);

        // Registrar conexión en DB
        await new ConnectionLog({
          userId,
          action: 'connected',
          timestamp: new Date(),
        }).save();

        // Notificar a la pareja
        socket.broadcast.emit('partner-online', { userId, username });

        console.log(`✅ ${username} (${userId}) se unió`);
      } catch (error) {
        console.error('Error en join:', error);
      }
    });

    // Together Mode: Streaming de audio
    socket.on('audio-stream', (data: { userId: string; audioData: any }) => {
      // Retransmitir audio a la pareja
      socket.broadcast.emit('incoming-audio', data);
    });

    // Iniciar Together Mode
    socket.on('start-together-mode', (data: { userId: string; username: string }) => {
      socket.broadcast.emit('together-mode-request', {
        userId: data.userId,
        username: data.username,
      });
      console.log(`💞 ${data.username} inició Together Mode`);
    });

    // Aceptar Together Mode
    socket.on('accept-together-mode', (data: { userId: string }) => {
      socket.broadcast.emit('together-mode-accepted', { userId: data.userId });
      console.log(`✅ Together Mode aceptado`);
    });

    // Finalizar Together Mode
    socket.on('end-together-mode', (data: { userId: string }) => {
      socket.broadcast.emit('together-mode-ended', { userId: data.userId });
      console.log(`⏹️ Together Mode finalizado`);
    });

    // Notificación de nueva foto
    socket.on('new-photo', (data: { userId: string; photoUrl: string; caption: string }) => {
      socket.broadcast.emit('photo-uploaded', data);
      console.log(`📸 Nueva foto de ${data.userId}`);
    });

    // Notificación de nuevo mensaje de voz
    socket.on('new-voice-message', (data: { userId: string; duration: number }) => {
      socket.broadcast.emit('voice-message-received', data);
      console.log(`🎤 Nuevo mensaje de voz de ${data.userId}`);
    });

    // Usuario está escribiendo
    socket.on('typing', (data: { userId: string; username: string }) => {
      socket.broadcast.emit('partner-typing', data);
    });

    // Sunset notification
    socket.on('sunset-time', (data: { userId: string; sunsetTime: string }) => {
      socket.broadcast.emit('partner-sunset', data);
      console.log(`🌅 Hora de atardecer compartida: ${data.sunsetTime}`);
    });

    // Desconexión
    socket.on('disconnect', async () => {
      try {
        // Buscar usuario desconectado
        let disconnectedUserId: string | null = null;

        for (const [userId, user] of connectedUsers.entries()) {
          if (user.socketId === socket.id) {
            disconnectedUserId = userId;
            connectedUsers.delete(userId);
            break;
          }
        }

        if (disconnectedUserId) {
          // Registrar desconexión en DB
          await new ConnectionLog({
            userId: disconnectedUserId,
            action: 'disconnected',
            timestamp: new Date(),
          }).save();

          // Notificar a la pareja
          socket.broadcast.emit('partner-offline', { userId: disconnectedUserId });

          console.log(`❌ Usuario ${disconnectedUserId} desconectado`);
        }
      } catch (error) {
        console.error('Error en disconnect:', error);
      }
    });
  });

  // Intervalo para verificar sunset (cada hora)
  setInterval(() => {
    io.emit('check-sunset');
  }, 60 * 60 * 1000); // Cada hora

  return io;
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};
