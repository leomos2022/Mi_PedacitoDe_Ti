import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePartner } from '../../hooks/usePartner';
import socketService from '../../services/socket';

const TogetherMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestFrom, setRequestFrom] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [processor, setProcessor] = useState<ScriptProcessorNode | null>(null);

  const { user } = useAuth();
  const { partner, isOnline } = usePartner();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Escuchar solicitudes de Together Mode
    socketService.onTogetherModeRequest((data) => {
      setShowRequest(true);
      setRequestFrom(data.username);
    });

    socketService.onTogetherModeAccepted(() => {
      setIsActive(true);
      startStreaming();
    });

    socketService.onTogetherModeEnded(() => {
      stopTogetherMode();
    });

    socketService.onIncomingAudio((audioData) => {
      // Reproducir audio entrante
      playReceivedAudio(audioData);
    });

    return () => {
      // Limpiar recursos al desmontar el componente
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (processor) {
        try {
          processor.disconnect();
        } catch (e) {
          // Ignorar si ya está desconectado
        }
      }
      if (audioContext && audioContext.state !== 'closed') {
        try {
          audioContext.close();
        } catch (e) {
          // Ignorar si ya está cerrado
        }
      }
    };
  }, [stream, processor, audioContext]);

  const playReceivedAudio = (audioData: any) => {
    try {
      if (!audioData || !audioData.audioData) {
        console.log('No hay datos de audio para reproducir');
        return;
      }

      console.log('🔊 Reproduciendo audio recibido...');

      // Crear un nuevo AudioContext si no existe o está cerrado
      let ctx = audioContext;
      if (!ctx || ctx.state === 'closed') {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        setAudioContext(ctx);
      }

      // Convertir los datos de audio a Float32Array
      const audioArray = new Float32Array(audioData.audioData);
      
      // Crear buffer de audio
      const audioBuffer = ctx.createBuffer(1, audioArray.length, ctx.sampleRate);
      audioBuffer.copyToChannel(audioArray, 0);

      // Reproducir el audio
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      
      // Conectar a la salida de audio
      source.connect(ctx.destination);
      source.start(0);
      
    } catch (error) {
      console.error('Error reproduciendo audio:', error);
    }
  };

  const startTogetherMode = async () => {
    if (!user || !isOnline) {
      alert('Tu pareja no está conectada');
      return;
    }

    // Pedir permiso del micrófono INMEDIATAMENTE
    try {
      console.log('🎤 Solicitando permiso del micrófono...');
      
      // Verificar soporte del navegador
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('❌ Tu navegador no soporta acceso al micrófono.\n\nUsa Chrome, Firefox o Safari.');
        return;
      }

      // Solicitar acceso al micrófono
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      // Guardar el stream
      setStream(mediaStream);
      
      console.log('✅ Permiso del micrófono concedido');
      
      // Ahora sí, iniciar el modo together
      setIsActive(true);
      socketService.startTogetherMode(user.id, user.username);
      
      // Iniciar streaming
      await setupAudioStreaming(mediaStream);
      
    } catch (error: any) {
      console.error('❌ Error al solicitar micrófono:', error);
      
      let errorMessage = '❌ No se pudo acceder al micrófono.\n\n';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Permiso denegado.\n\n' +
          '📱 Para habilitar el micrófono:\n\n' +
          '1. Haz clic en el icono 🔒 (candado) en la barra de direcciones\n' +
          '2. Cambia "Micrófono" a "Permitir"\n' +
          '3. Recarga la página e intenta de nuevo';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No se encontró ningún micrófono conectado.\n\nVerifica que tu micrófono esté conectado.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'El micrófono está siendo usado por otra aplicación.\n\nCierra otras apps que usen el micrófono.';
      } else {
        errorMessage += error.message || 'Error desconocido';
      }
      
      alert(errorMessage);
    }
  };

  const acceptTogetherMode = async () => {
    if (!user) return;

    // Pedir permiso del micrófono al aceptar
    try {
      console.log('🎤 Solicitando permiso del micrófono...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      setStream(mediaStream);
      setShowRequest(false);
      setIsActive(true);
      
      socketService.acceptTogetherMode(user.id);
      
      await setupAudioStreaming(mediaStream);
      
      console.log('✅ Together Mode aceptado con micrófono activo');
      
    } catch (error: any) {
      console.error('❌ Error al solicitar micrófono:', error);
      
      setShowRequest(false);
      
      let errorMessage = '❌ No se pudo acceder al micrófono.\n\n';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Para usar el Modo Juntos necesitas permitir el micrófono.\n\n' +
          '1. Haz clic en el icono 🔒 en la barra de direcciones\n' +
          '2. Cambia "Micrófono" a "Permitir"\n' +
          '3. Intenta de nuevo';
      }
      
      alert(errorMessage);
    }
  };

  const rejectTogetherMode = () => {
    setShowRequest(false);
    setRequestFrom('');
  };

  const setupAudioStreaming = async (mediaStream: MediaStream) => {
    try {
      setIsStreaming(true);
      console.log('🎤 Configurando transmisión de audio...');
      
      // Crear AudioContext para procesar el audio
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      setAudioContext(ctx);

      const source = ctx.createMediaStreamSource(mediaStream);
      const proc = ctx.createScriptProcessor(2048, 1, 1);
      setProcessor(proc);

      // Procesar y enviar audio en tiempo real
      proc.onaudioprocess = (e) => {
        if (!user) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Reducir muestras para transmisión más eficiente
        const reducedData = [];
        for (let i = 0; i < inputData.length; i += 4) {
          reducedData.push(inputData[i]);
        }
        
        // Enviar audio a través de Socket.io
        socketService.sendAudio({
          userId: user.id,
          audioData: reducedData
        });
      };

      source.connect(proc);
      proc.connect(ctx.destination);

      console.log('✅ Transmitiendo audio en tiempo real');
      
    } catch (error) {
      console.error('Error configurando streaming:', error);
      alert('Error al configurar la transmisión de audio');
      setIsActive(false);
      setIsStreaming(false);
    }
  };

  const startStreaming = async () => {
    try {
      console.log('Solicitando acceso al micrófono...');
      
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Tu navegador no soporta acceso al micrófono. Usa Chrome, Firefox o Safari.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Reducir calidad para mejor rendimiento
        },
      });

      setStream(mediaStream);
      setIsStreaming(true);

      console.log('✅ Micrófono activado - Iniciando transmisión');
      
      // Crear AudioContext para procesar el audio
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      setAudioContext(ctx);

      const source = ctx.createMediaStreamSource(mediaStream);
      const proc = ctx.createScriptProcessor(2048, 1, 1); // Buffer más pequeño
      setProcessor(proc);

      // Procesar y enviar audio en tiempo real
      proc.onaudioprocess = (e) => {
        if (!user) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Reducir muestras para transmisión más eficiente (cada 4 muestras)
        const reducedData = [];
        for (let i = 0; i < inputData.length; i += 4) {
          reducedData.push(inputData[i]);
        }
        
        // Enviar audio a través de Socket.io
        socketService.sendAudio({
          userId: user.id,
          audioData: reducedData
        });
      };

      source.connect(proc);
      proc.connect(ctx.destination);

      console.log('🎤 Transmitiendo audio en tiempo real');
      
    } catch (error: any) {
      console.error('Error accediendo al micrófono:', error);
      
      let errorMessage = 'No se pudo acceder al micrófono.';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = '❌ Permiso denegado.\n\nPara habilitar el micrófono:\n\n' +
          '1. Haz clic en el icono 🔒 (candado) en la barra de direcciones\n' +
          '2. Cambia "Micrófono" a "Permitir"\n' +
          '3. Recarga la página';
      } else if (error.name === 'NotFoundError') {
        errorMessage = '❌ No se encontró ningún micrófono conectado.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = '❌ El micrófono está siendo usado por otra aplicación.';
      }
      
      alert(errorMessage);
      setIsActive(false);
      setIsStreaming(false);
    }
  };

  const stopTogetherMode = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (processor) {
      try {
        processor.disconnect();
      } catch (e) {
        // Ignorar si ya está desconectado
      }
      setProcessor(null);
    }

    if (audioContext && audioContext.state !== 'closed') {
      try {
        audioContext.close();
      } catch (e) {
        // Ignorar si ya está cerrado
      }
      setAudioContext(null);
    }

    setIsActive(false);
    setIsStreaming(false);

    if (user) {
      socketService.endTogetherMode(user.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">💞</span>
          Modo Juntos
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isOnline ? '🟢 En línea' : '⚫ Desconectado'}
        </div>
      </div>

      {/* Solicitud entrante */}
      {showRequest && (
        <div className="mb-4 bg-pink-50 border-2 border-pink-200 rounded-xl p-4 animate-pulse">
          <p className="text-center text-pink-800 font-semibold mb-3">
            🎤 {requestFrom} quiere conectarse contigo
          </p>
          <div className="flex gap-2">
            <button
              onClick={acceptTogetherMode}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ✓ Aceptar
            </button>
            <button
              onClick={rejectTogetherMode}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              ✗ Rechazar
            </button>
          </div>
        </div>
      )}

      {/* Estado actual */}
      <div className={`p-6 rounded-xl mb-4 ${
        isActive
          ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300'
          : 'bg-gray-50'
      }`}>
        <div className="text-center">
          {isActive ? (
            <>
              <div className="mb-4">
                <div className="inline-block p-4 bg-white rounded-full shadow-lg animate-bounce">
                  <span className="text-4xl">🎤</span>
                </div>
              </div>
              <p className="text-xl font-bold text-pink-600 mb-2">
                Conectados en Tiempo Real
              </p>
              <p className="text-gray-600">
                {isStreaming ? 'Transmitiendo audio...' : 'Preparando conexión...'}
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <span className="text-6xl">💕</span>
              </div>
              <p className="text-lg text-gray-600">
                Conecta con {partner?.username || 'tu pareja'} en tiempo real
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Escuchen lo que está pasando alrededor del otro
              </p>
            </>
          )}
        </div>
      </div>

      {/* Botones de control */}
      <div className="space-y-2">
        {!isActive ? (
          <>
            <button
              onClick={startTogetherMode}
              disabled={!isOnline}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                isOnline
                  ? 'bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isOnline ? '🎤 Iniciar Modo Juntos' : '⏸️ Esperando conexión...'}
            </button>
            
            {isOnline && (
              <div className="text-xs text-center text-gray-500 mt-2">
                📢 Al hacer clic, el navegador te pedirá permiso para usar el micrófono
              </div>
            )}
          </>
        ) : (
          <button
            onClick={stopTogetherMode}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            ⏹️ Finalizar Conexión
          </button>
        )}
      </div>

      {/* Información */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> El Modo Juntos transmite audio en tiempo real para que puedan 
          sentirse más cerca. Perfecto para compartir momentos cotidianos.
        </p>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default TogetherMode;
