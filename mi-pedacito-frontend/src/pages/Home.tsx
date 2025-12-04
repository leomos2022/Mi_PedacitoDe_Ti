import React from 'react';
import Header from '../components/Layout/Header';
import TogetherMode from '../components/Dashboard/TogetherMode';
import PhotoGallery from '../components/Dashboard/PhotoGallery';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Together Mode - Sidebar */}
          <div className="lg:col-span-1">
            <TogetherMode />
          </div>

          {/* Photo Gallery - Main Content */}
          <div className="lg:col-span-2">
            <PhotoGallery />
          </div>
        </div>

        {/* Info card */}
        <div 
          className="mt-8 rounded-2xl p-6 border border-cyan-200"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 30, 36, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)'
          }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            💝 Bienvenido a Mi Pedacito de Ti
          </h3>
          <p className="text-gray-700 mb-4">
            Esta app fue creada especialmente para mantenerlos conectados sin importar la distancia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">💞</div>
              <h4 className="font-semibold text-gray-800 mb-1">Modo Juntos</h4>
              <p className="text-sm text-gray-600">
                Escuchen el ambiente del otro en tiempo real
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">📸</div>
              <h4 className="font-semibold text-gray-800 mb-1">Galería Compartida</h4>
              <p className="text-sm text-gray-600">
                Compartan momentos del día con fotos
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">🌅</div>
              <h4 className="font-semibold text-gray-800 mb-1">Atardeceres Sincronizados</h4>
              <p className="text-sm text-gray-600">
                Notificaciones cuando ambos vean el atardecer
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
