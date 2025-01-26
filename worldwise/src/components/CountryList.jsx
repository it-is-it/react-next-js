import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  // Using a Set to track countries and filter duplicates
  const countrySet = new Set();
  const countries = cities
    .filter((city) => {
      if (!countrySet.has(city.country)) {
        countrySet.add(city.country);
        return true;
      }
      return false;
    })
    .map((city) => ({
      country: city.country,
      emoji: city.emoji,
    }));

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
