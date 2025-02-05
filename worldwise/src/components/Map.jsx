import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([27.6653, 85.2715]);
  const {
    getPosition,
    position: geolocationPosition,
    isLoading: isLoadingPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (!isNaN(mapLat) && !isNaN(mapLng)) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  if (!cities || cities.length === 0) {
    return <div>No cities to display</div>;
  }

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          const position = city.position;

          // Debug log to check city and position data
          if (!position) {
            console.warn(`City ${city.cityName} has no position data`);
            return null; // Skip this city if no position data is available
          }

          const { lat, lng } = position;
          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`City ${city.cityName} has invalid position data:`, position);
            return null; // Skip this city if position data is invalid
          }

          return (
            <Marker position={[lat, lng]} key={city.id}>
              <Popup>
                <div>
                  <span role="img" aria-label={`Flag of ${city.cityName}`}>
                    {city.emoji}
                  </span>{' '}
                  <strong>{city.cityName}</strong>
                  <p>{city.notes}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter
          position={
            !isNaN(mapLat) && !isNaN(mapLng) ? [mapLat, mapLng] : mapPosition
          }
        />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
