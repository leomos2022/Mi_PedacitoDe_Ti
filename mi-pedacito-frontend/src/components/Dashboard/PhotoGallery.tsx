import React, { useState, useEffect } from 'react';
import { Photo } from '../../types';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket';

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other'>('other');
  const [category, setCategory] = useState<'together_mode' | 'shared_gallery' | 'synchronized_sunsets' | 'general'>('general');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    loadPhotos();

    // Escuchar nuevas fotos en tiempo real
    socketService.onPhotoUploaded(() => {
      loadPhotos();
    });
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await api.getAllPhotos(50, 0);
      setPhotos(response.photos);
    } catch (error) {
      console.error('Error cargando fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('caption', caption);
      formData.append('mealType', mealType);
      formData.append('category', category);

      const response = await api.uploadPhoto(formData);

      // Notificar a la pareja
      socketService.notifyNewPhoto(
        user.id,
        response.photo.imageUrl,
        caption
      );

      // Recargar fotos
      await loadPhotos();

      // Resetear formulario
      setSelectedFile(null);
      setCaption('');
      setMealType('other');
      setCategory('general');
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error subiendo foto:', error);
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta foto?')) return;

    try {
      await api.deletePhoto(photoId);
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

  const handleDeleteFromModal = async () => {
    if (!selectedPhoto) return;
    
    if (window.confirm('¿Estás seguro de eliminar esta foto?')) {
      try {
        await api.deletePhoto(selectedPhoto._id);
        closePhotoModal();
        await loadPhotos();
      } catch (error) {
        console.error('Error eliminando foto:', error);
        alert('Error al eliminar la foto');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📸</span>
          Galería de Fotos
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
        >
          + Subir Foto
        </button>
      </div>

      {/* Modal de subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Subir Nueva Foto</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>

              {selectedFile && (
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Comparte lo que estás haciendo..."
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de momento
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="breakfast">🌅 Desayuno</option>
                  <option value="lunch">☀️ Comida</option>
                  <option value="dinner">🌙 Cena</option>
                  <option value="snack">🍪 Snack</option>
                  <option value="other">📸 Otro momento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="general">📷 General</option>
                  <option value="together_mode">💞 Modo Juntos</option>
                  <option value="shared_gallery">📸 Galería Compartida</option>
                  <option value="synchronized_sunsets">🌅 Atardeceres Sincronizados</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Subiendo...' : 'Subir'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setCaption('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📷</span>
          <p className="text-gray-600">No hay fotos aún</p>
          <p className="text-sm text-gray-500 mt-2">Sube tu primera foto para comenzar a crear recuerdos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            const photoUser = typeof photo.userId === 'object' ? photo.userId : null;
            const isOwnPhoto = user?.id === (photoUser?.id || photo.userId);

            return (
              <div 
                key={photo._id} 
                className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openPhotoModal(photo, index)}
              >
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">
                        {photoUser?.username || 'Usuario'}
                      </span>
                      <span className="text-lg">
                        {getMealEmoji(photo.mealType)}
                      </span>
                    </div>
                    {photo.caption && (
                      <p className="text-xs line-clamp-2">{photo.caption}</p>
                    )}
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(photo.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Botón de eliminar (solo para fotos propias) */}
                {isOwnPhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Botón anterior */}
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

          {/* Botón siguiente */}
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
                    onClick={handleDeleteFromModal}
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

export default PhotoGallery;
