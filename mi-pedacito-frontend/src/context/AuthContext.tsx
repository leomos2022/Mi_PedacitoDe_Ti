import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';
import socketService from '../services/socket';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserLocation: (lat: number, lng: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Conectar socket
          socketService.connect(userData.id, userData.username);

          // Verificar que el token sigue siendo válido
          try {
            const response = await api.getProfile();
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } catch (error) {
            console.error('Token inválido, limpiando sesión');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Conectar socket
      socketService.connect(userData.id, userData.username);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Obtener ubicación del usuario
      let location = { lat: 0, lng: 0 };
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.log('No se pudo obtener ubicación, usando default');
        }
      }

      const response = await api.register({
        username,
        email,
        password,
        timezone,
        location,
      });

      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Conectar socket
      socketService.connect(userData.id, userData.username);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.error || 'Error al registrar usuario');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    socketService.disconnect();
  };

  const updateUserLocation = async (lat: number, lng: number) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await api.updateLocation({ lat, lng, timezone });
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
