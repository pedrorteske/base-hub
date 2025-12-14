import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockBases } from '@/data/mockBases';
import { baseCoordinates } from '@/data/baseCoordinates';
import { Plane } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicGVkcm9ydGVza2UiLCJhIjoiY21qNjBzc2pyMjRrNzNjb2pub2VkaG85ZiJ9.xtaW5jdy5Ae7NQ1odvoa7w';

interface BrazilMapProps {
  onBaseClick?: (baseId: string) => void;
}

const BrazilMap = ({ onBaseClick }: BrazilMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedBase, setSelectedBase] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-52, -14],
      zoom: 3.8,
      pitch: 0,
      bearing: 0,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      // Add markers for each base
      const uniqueCities = new Map<string, { base: typeof mockBases[0]; coords: { lat: number; lng: number } }>();
      
      mockBases.forEach((base) => {
        const coords = baseCoordinates[base.city];
        if (coords && !uniqueCities.has(base.city)) {
          uniqueCities.set(base.city, { base, coords });
        }
      });

      uniqueCities.forEach(({ base, coords }) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'base-marker';
        el.innerHTML = `
          <div class="marker-container">
            <div class="marker-pulse"></div>
            <div class="marker-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedBase(base.id);
          onBaseClick?.(base.id);
          
          map.current?.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 8,
            duration: 1500,
          });
        });

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: 'base-popup',
        }).setHTML(`
          <div class="popup-content">
            <h3 class="popup-title">${base.city}</h3>
            <p class="popup-code">${base.icaoCode}</p>
            <p class="popup-status ${base.status}">${base.status === 'operational' ? 'Operacional' : base.status === 'restricted' ? 'Restrito' : 'Fechado'}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coords.lng, coords.lat])
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener('mouseenter', () => marker.togglePopup());
        el.addEventListener('mouseleave', () => marker.togglePopup());

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [onBaseClick]);

  return (
    <>
      <style>{`
        .base-marker {
          cursor: pointer;
        }
        
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          background: hsl(var(--primary) / 0.3);
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }
        
        .marker-icon {
          position: relative;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--primary-foreground));
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .marker-container:hover .marker-icon {
          transform: scale(1.15);
          box-shadow: 0 6px 20px hsl(var(--primary) / 0.6);
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .mapboxgl-popup-content {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 10px 40px hsl(var(--background) / 0.5);
        }
        
        .mapboxgl-popup-tip {
          border-top-color: hsl(var(--card));
        }
        
        .popup-content {
          text-align: center;
        }
        
        .popup-title {
          font-weight: 600;
          font-size: 14px;
          color: hsl(var(--foreground));
          margin: 0 0 4px 0;
        }
        
        .popup-code {
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          font-family: monospace;
          margin: 0 0 6px 0;
        }
        
        .popup-status {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 9999px;
          display: inline-block;
          margin: 0;
        }
        
        .popup-status.operational {
          background: hsl(142 76% 36% / 0.2);
          color: hsl(142 76% 46%);
        }
        
        .popup-status.restricted {
          background: hsl(38 92% 50% / 0.2);
          color: hsl(38 92% 50%);
        }
        
        .popup-status.closed {
          background: hsl(0 84% 60% / 0.2);
          color: hsl(0 84% 60%);
        }
      `}</style>
      <div ref={mapContainer} className="w-full h-full rounded-xl" />
    </>
  );
};

export default BrazilMap;
