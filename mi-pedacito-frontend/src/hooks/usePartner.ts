import { useState, useEffect } from 'react';
import { User } from '../types';
import socketService from '../services/socket';
import api from '../services/api';

export const usePartner = () => {
  const [partner, setPartner] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const response = await api.getPartner();
        setPartner(response.partner);
      } catch (error) {
        console.error('Error cargando pareja:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartner();

    // Escuchar eventos de conexión/desconexión
    socketService.onPartnerOnline((data) => {
      setIsOnline(true);
    });

    socketService.onPartnerOffline((data) => {
      setIsOnline(false);
    });
  }, []);

  return { partner, isOnline, loading };
};
