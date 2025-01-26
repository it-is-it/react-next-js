import { useNavigate, useSearchParams } from 'react-router-dom';
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

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([27.6653, 85.2715]);
  const [searchParams] = useSearchParams();
  const {
    getPosition,
    position: geolocationPosition,
    isLoading: isLoadingPosition,
  } = useGeolocation();

  const mapLat = parseFloat(searchParams.get('lat'));
  const mapLng = parseFloat(searchParams.get('lng'));

  useEffect(() => {
    if (!isNaN(mapLat) && !isNaN(mapLng)) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  if (!cities || cities.length === 0) {
    return <div>No cities to display</div>;
  }

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? 'Loading...' : 'Use your position'}
      </Button>
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
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
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
        ))}
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
    click: (e) => navigate(`form?lat=${e.latlng.lat}lng=${e.latlng.lng}`),
  });
}

export default Map;
