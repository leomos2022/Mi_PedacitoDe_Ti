import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import TogetherMode from '../components/Dashboard/TogetherMode';
import PhotoGallery from '../components/Dashboard/PhotoGallery';
import CategoryGallery from '../components/Dashboard/CategoryGallery';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'together' | 'shared' | 'sunsets'>('all');

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
            {/* Tabs de navegación */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📸 Todas
                </button>
                <button
                  onClick={() => setActiveTab('together')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'together'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  💞 Juntos
                </button>
                <button
                  onClick={() => setActiveTab('shared')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'shared'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📷 Compartida
                </button>
                <button
                  onClick={() => setActiveTab('sunsets')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'sunsets'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🌅 Atardeceres
                </button>
              </div>
            </div>

            {/* Contenido según el tab activo */}
            {activeTab === 'all' && <PhotoGallery />}
            {activeTab === 'together' && (
              <CategoryGallery
                category="together_mode"
                title="Modo Juntos"
                emoji="💞"
                description="Momentos especiales que compartieron juntos"
              />
            )}
            {activeTab === 'shared' && (
              <CategoryGallery
                category="shared_gallery"
                title="Galería Compartida"
                emoji="📷"
                description="Fotos del día a día que quieren compartir"
              />
            )}
            {activeTab === 'sunsets' && (
              <CategoryGallery
                category="synchronized_sunsets"
                title="Atardeceres Sincronizados"
                emoji="🌅"
                description="Atardeceres que vieron al mismo tiempo"
              />
            )}
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
