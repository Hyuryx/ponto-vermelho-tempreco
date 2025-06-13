
import { useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  loading: boolean;
  error?: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData>({
    lat: 0,
    lng: 0,
    loading: true
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TempPreco-TimeTracking/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Erro na geocodificação');
      }
      
      const data = await response.json();
      
      // Simplificar as informações - mostrar apenas rua, bairro e estado
      const road = data.address?.road || '';
      const houseNumber = data.address?.house_number || '';
      const suburb = data.address?.suburb || data.address?.neighbourhood || '';
      const state = data.address?.state || '';
      
      // Construir endereço simplificado
      let simplifiedAddress = '';
      if (road) {
        simplifiedAddress = road;
        if (houseNumber) {
          simplifiedAddress += `, ${houseNumber}`;
        }
      }
      
      const address = simplifiedAddress || 'Endereço não encontrado';
      const city = suburb || 'Bairro não encontrado';
      const country = state || 'Estado não encontrado';
      
      return { address, city, country };
    } catch (error) {
      console.error('Erro na geocodificação reversa:', error);
      return {
        address: 'Endereço não disponível',
        city: 'Bairro não disponível',
        country: 'Estado não disponível'
      };
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocalização não suportada pelo navegador'
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log('Posição obtida:', { latitude, longitude });
        
        setLocation(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          loading: true
        }));

        // Fazer geocodificação reversa
        const addressData = await reverseGeocode(latitude, longitude);
        
        setLocation(prev => ({
          ...prev,
          ...addressData,
          loading: false
        }));
      },
      (error) => {
        console.error('Erro na geolocalização:', error);
        let errorMessage = 'Erro desconhecido';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão negada para acessar localização';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout na obtenção da localização';
            break;
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
};
