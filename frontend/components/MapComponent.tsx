'use client'

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  location: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      // Ensure you have a valid Google Maps API key
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          // Create a geocoder to convert location to coordinates
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const map = new google.maps.Map(mapRef.current!, {
                center: results[0].geometry.location,
                zoom: 10,
                mapTypeControl: false,
                streetViewControl: false,
              });

              // Add a marker
              new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: location
              });
            } else {
              console.error('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps', error);
      }
    };

    if (location) {
      initMap();
    }
  }, [location]);

  return <div ref={mapRef} className="h-full w-full rounded-lg shadow-md" />;
};

export default MapComponent;