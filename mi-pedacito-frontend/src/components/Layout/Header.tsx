import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePartner } from '../../hooks/usePartner';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Mi Pedacito de Ti' }) => {
  const { user, logout } = useAuth();
  const { partner, isOnline } = usePartner();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header style={{ background: 'linear-gradient(90deg, rgba(0, 30, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)' }} className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              💕 {title}
            </h1>
            <p className="text-cyan-100 text-sm mt-1">
              Hola, {user?.username}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {partner && (
              <div className="hidden sm:flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                <span className="text-white text-sm font-medium">
                  {partner.username} {isOnline ? 'conectado' : 'desconectado'}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105 transform"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
