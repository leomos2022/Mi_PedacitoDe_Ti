import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import socketService from '../services/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentSocket = socketService.getSocket();
    setSocket(currentSocket);

    if (currentSocket) {
      setIsConnected(currentSocket.connected);

      currentSocket.on('connect', () => {
        setIsConnected(true);
      });

      currentSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        currentSocket.off('connect');
        currentSocket.off('disconnect');
      };
    }
  }, []);

  return { socket, isConnected };
};
