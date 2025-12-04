import React, { useState, useEffect, useCallback } from 'react';
import { Photo } from '../../types';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket';

interface CategoryGalleryProps {
  category: 'together_mode' | 'shared_gallery' | 'synchronized_sunsets';
  title: string;
  emoji: string;
  description: string;
}

const CategoryGallery: React.FC<CategoryGalleryProps> = ({ category, title, emoji, description }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { user } = useAuth();

  const loadPhotos = useCallback(async () => {
    try {
      // Usar el endpoint de categoría cuando esté disponible
      const response = await api.getAllPhotos(50, 0);
      // Filtrar por categoría en el frontend por ahora
      const filtered = response.photos.filter((p: Photo) => 
        (p as any).category === category
      );
      setPhotos(filtered);
    } catch (error) {
      console.error('Error cargando fotos:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadPhotos();

    // Escuchar nuevas fotos en tiempo real
    socketService.onPhotoUploaded(() => {
      loadPhotos();
    });
  }, [loadPhotos]);

  const openPhotoModal = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      const newIndex = photoIndex + 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const prevPhoto = () => {
    if (photoIndex > 0) {
      const newIndex = photoIndex - 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta foto?')) return;

    try {
      await api.deletePhoto(photoId);
      closePhotoModal();
      await loadPhotos();
    } catch (error) {
      console.error('Error eliminando foto:', error);
      alert('Error al eliminar la foto');
    }
  };

  const getMealEmoji = (meal: string) => {
    const emojis: Record<string, string> = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍪',
      other: '📸',
    };
    return emojis[meal] || '📸';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
          <span className="mr-2">{emoji}</span>
          {title}
        </h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-3 block">{emoji}</span>
          <p className="text-gray-600">No hay fotos en esta categoría aún</p>
          <p className="text-sm text-gray-500 mt-2">
            Sube fotos y selecciona "{title}" al subirlas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, index) => {
            const photoUser = typeof photo.userId === 'object' ? photo.userId : null;
            const isOwnPhoto = user?.id === (photoUser?.id || photo.userId);

            return (
              <div
                key={photo._id}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => openPhotoModal(photo, index)}
              >
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <p className="text-xs font-semibold">
                      {photoUser?.username || 'Usuario'}
                    </p>
                    <p className="text-xs opacity-75">
                      {new Date(photo.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {isOwnPhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para ver foto en grande */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <button
            onClick={closePhotoModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {photoIndex > 0 && (
            <button
              onClick={prevPhoto}
              className="absolute left-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {photoIndex < photos.length - 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="max-w-5xl w-full">
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            <div className="bg-white rounded-b-lg p-6 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getMealEmoji(selectedPhoto.mealType)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {typeof selectedPhoto.userId === 'object'
                        ? selectedPhoto.userId.username
                        : 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedPhoto.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {user?.id === (typeof selectedPhoto.userId === 'object' ? selectedPhoto.userId.id : selectedPhoto.userId) && (
                  <button
                    onClick={() => handleDelete(selectedPhoto._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                )}
              </div>

              {selectedPhoto.caption && (
                <p className="text-gray-700 text-lg">{selectedPhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;
