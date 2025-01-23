import React, { useState, useEffect } from 'react';

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], '☀️'],
    [[1], '🌤'],
    [[2], '⛅️'],
    [[3], '☁️'],
    [[45, 48], '🌫'],
    [[51, 56, 61, 66, 80], '🌦'],
    [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
    [[71, 73, 75, 77, 85, 86], '🌨'],
    [[95], '🌩'],
    [[96, 99], '⛈'],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  return icons.get(arr) || '❓'; // Fallback icon
}

function convertToFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) {
    console.error('Invalid country code:', countryCode);
    return '🏳';
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function App() {
  const [location, setLocation] = useState(
    () => localStorage.getItem('location') || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('');
  const [error, setError] = useState('');
  const [weather, setWeather] = useState({
    weathercode: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    time: [],
  });

  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) setLocation(storedLocation);
  }, []);

  useEffect(() => {
    if (location) localStorage.setItem('location', location);
  }, [location]);

  useEffect(() => {
    async function fetchWeather() {
      if (location.trim().length < 2) return;
      try {
        setIsLoading(true);
        setError('');

        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location.toLowerCase()}`
        );
        if (!geoRes.ok) throw new Error('Geocoding API failed');

        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0)
          throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        if (!weatherRes.ok) throw new Error('Weather API failed');

        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
      } catch (err) {
        setError(err.message || 'Failed to fetch weather. Please try again');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  useEffect(() => {
    if (displayLocation) {
      document.title = `Weather in ${displayLocation}`;
    }
  }, [displayLocation]);

  const debouncedSetLocation = debounce(setLocation, 500);

  return (
    <div className="app">
      <h1>Forecastify</h1>
      <Input
        location={location}
        onChangeLocation={(e) => debouncedSetLocation(e.target.value)}
        isLoading={isLoading}
      />
      {isLoading && !error && (
        <p className="loader" aria-live="polite">
          Loading...
        </p>
      )}
      {error && (
        <p className="error" aria-live="assertive">
          {error}
        </p>
      )}

      {weather.weathercode && weather.time.length > 0 && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}

function Input({ location, onChangeLocation, isLoading }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for location..."
        value={location}
        onChange={onChangeLocation}
        aria-label="Enter location to search weather"
        disabled={isLoading}
      />
    </div>
  );
}

function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  return (
    <div>
      <h2>Weather in {location}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            date={date}
            max={max.at(i)}
            min={min.at(i)}
            code={codes.at(i)}
            key={date}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}

function Day({ date, max, min, code, isToday }) {
  return (
    <li className={`day ${isToday ? 'today' : ''}`}>
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? 'Today' : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}
