import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string, username: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado a Socket.io');
      this.socket?.emit('join', { userId, username });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.io');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Together Mode
  startTogetherMode(userId: string, username: string) {
    this.socket?.emit('start-together-mode', { userId, username });
  }

  acceptTogetherMode(userId: string) {
    this.socket?.emit('accept-together-mode', { userId });
  }

  endTogetherMode(userId: string) {
    this.socket?.emit('end-together-mode', { userId });
  }

  sendAudioStream(userId: string, audioData: any) {
    this.socket?.emit('audio-stream', { userId, audioData });
  }

  sendAudio(data: { userId: string; audioData: number[] }) {
    this.socket?.emit('audio-stream', data);
  }

  // Notificaciones
  notifyNewPhoto(userId: string, photoUrl: string, caption: string) {
    this.socket?.emit('new-photo', { userId, photoUrl, caption });
  }

  notifyNewVoiceMessage(userId: string, duration: number) {
    this.socket?.emit('new-voice-message', { userId, duration });
  }

  sendTyping(userId: string, username: string) {
    this.socket?.emit('typing', { userId, username });
  }

  sendSunsetTime(userId: string, sunsetTime: string) {
    this.socket?.emit('sunset-time', { userId, sunsetTime });
  }

  // Listeners
  onPartnerOnline(callback: (data: { userId: string; username: string }) => void) {
    this.socket?.on('partner-online', callback);
  }

  onPartnerOffline(callback: (data: { userId: string }) => void) {
    this.socket?.on('partner-offline', callback);
  }

  onIncomingAudio(callback: (data: any) => void) {
    this.socket?.on('incoming-audio', callback);
  }

  onTogetherModeRequest(callback: (data: { userId: string; username: string }) => void) {
    this.socket?.on('together-mode-request', callback);
  }

  onTogetherModeAccepted(callback: (data: { userId: string }) => void) {
    this.socket?.on('together-mode-accepted', callback);
  }

  onTogetherModeEnded(callback: (data: { userId: string }) => void) {
    this.socket?.on('together-mode-ended', callback);
  }

  onPhotoUploaded(callback: (data: { userId: string; photoUrl: string; caption: string }) => void) {
    this.socket?.on('photo-uploaded', callback);
  }

  onVoiceMessageReceived(callback: (data: { userId: string; duration: number }) => void) {
    this.socket?.on('voice-message-received', callback);
  }

  onPartnerTyping(callback: (data: { userId: string; username: string }) => void) {
    this.socket?.on('partner-typing', callback);
  }

  onPartnerSunset(callback: (data: { userId: string; sunsetTime: string }) => void) {
    this.socket?.on('partner-sunset', callback);
  }

  onCheckSunset(callback: () => void) {
    this.socket?.on('check-sunset', callback);
  }
}

const socketService = new SocketService();
export default socketService;
