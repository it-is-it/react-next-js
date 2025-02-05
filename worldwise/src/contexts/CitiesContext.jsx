import {
  useCallback,
  useContext,
  useReducer,
  createContext,
  useEffect,
} from 'react';

const BASE_URL = import.meta.env.VITE_JSONBIN_URL;

const CitiesContext = createContext();

const initialstate = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialstate
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data.record.cities });
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error fetching cities.',
        });
      }
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${BASE_URL}`);
        const data = await res.json();

        const city = data.record.cities.find((city) => city.id === id);
        if (city) {
          dispatch({ type: 'city/loaded', payload: city });
        } else {
          dispatch({
            type: 'rejected',
            payload: 'City not found.',
          });
        }
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading the city.',
        });
      }
    },
    [currentCity.id]
  );

  const createCity = async (newCity) => {
    dispatch({ type: 'loading' });

    try {
      // Fetch the current data from the bin
      const res = await fetch(`${BASE_URL}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key':
            '$2a$10$97Esa/.03mDL9ZCWPXP2s.Dgd2v8RXT5V6fs/fbdC9k9n0FgLjPpi',
          'X-Access-Key':
            '$2a$10$HVAWhpWVTMcLndmKlV/Xf.tSpOxIJaadVDZbbEBbeZTBciiDKRowq',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data from the bin');
      }

      const data = await res.json();

      // Add the new city to the data
      const newCityData = {
        ...newCity,
        id: Math.random().toString(36).substring(2), // Generate a random ID for the new city
      };

      const updatedCities = [...data.record.cities, newCityData];

      // Send the updated data back to the bin
      const updateRes = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key':
            '$2a$10$97Esa/.03mDL9ZCWPXP2s.Dgd2v8RXT5V6fs/fbdC9k9n0FgLjPpi',
          'X-Access-Key':
            '$2a$10$HVAWhpWVTMcLndmKlV/Xf.tSpOxIJaadVDZbbEBbeZTBciiDKRowq',
        },
        body: JSON.stringify({ cities: updatedCities }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update cities');
      }

      const updatedData = await updateRes.json();

      // Dispatch updated city list to trigger a re-render
      dispatch({ type: 'city/created', payload: updatedCities });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: `There was an error creating a city: ${error.message}`,
      });
      console.error('Error during city creation:', error); // Log more details on the error
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}`);
      const data = await res.json();

      const updatedCities = data.record.cities.filter((city) => city.id !== id);

      const updateRes = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key':
            '$2a$10$97Esa/.03mDL9ZCWPXP2s.Dgd2v8RXT5V6fs/fbdC9k9n0FgLjPpi',
        },
        body: JSON.stringify({ cities: updatedCities }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update cities');
      }

      const updatedData = await updateRes.json();
      dispatch({ type: 'city/deleted', payload: id });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: `There was an error deleting the city: ${error.message}`,
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was used outside the CitiesProvider');
  return context;
}

export { useCities, CitiesProvider };
