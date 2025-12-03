// Utilidad para calcular hora del atardecer basado en ubicación
export interface Location {
  lat: number;
  lng: number;
}

export const calculateSunsetTime = async (location: Location): Promise<Date> => {
  try {
    // Usar API gratuita de sunrise-sunset.org
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}&formatted=0`
    );
    const data = await response.json();

    if (data.status === 'OK') {
      return new Date(data.results.sunset);
    }

    // Fallback: 6 PM hora local
    const sunset = new Date();
    sunset.setHours(18, 0, 0, 0);
    return sunset;
  } catch (error) {
    console.error('Error calculando hora de atardecer:', error);
    // Fallback: 6 PM hora local
    const sunset = new Date();
    sunset.setHours(18, 0, 0, 0);
    return sunset;
  }
};

// Verificar si ambos usuarios están cerca de su atardecer (dentro de 30 min)
export const areBothNearSunset = async (
  location1: Location,
  location2: Location
): Promise<{ isNear: boolean; sunsetUser1: Date; sunsetUser2: Date }> => {
  const sunsetUser1 = await calculateSunsetTime(location1);
  const sunsetUser2 = await calculateSunsetTime(location2);

  const now = new Date();
  const thirtyMinutes = 30 * 60 * 1000; // 30 minutos en ms

  const nearSunset1 = Math.abs(now.getTime() - sunsetUser1.getTime()) < thirtyMinutes;
  const nearSunset2 = Math.abs(now.getTime() - sunsetUser2.getTime()) < thirtyMinutes;

  return {
    isNear: nearSunset1 || nearSunset2,
    sunsetUser1,
    sunsetUser2,
  };
};

// Formatear fecha/hora para display
export const formatSunsetTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
