import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherCard } from './components/WeatherCard';
import { WeatherDetails } from './components/WeatherDetails';
import { ForecastCard } from './components/ForecastCard';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherTips } from './components/WeatherTips';
import { RecentSearches } from './components/RecentSearches';
import { FavoritesModal } from './components/FavoritesModal';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  type WeatherResponse,
  type ForecastResponse,
} from './utils/weatherApi';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
}

interface ForecastData {
  date: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
}

interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
}

// Local storage keys
const STORAGE_KEYS = {
  RECENT_SEARCHES: 'clima_recent_searches',
  FAVORITES: 'clima_favorites',
  UNIT_PREFERENCE: 'clima_unit_preference',
};

export default function App() {
  const [unit, setUnit] = useState<'C' | 'F'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.UNIT_PREFERENCE) as 'C' | 'F') || 'C';
  });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [detectingLocation, setDetectingLocation] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // Save to localStorage whenever these change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNIT_PREFERENCE, unit);
  }, [unit]);

  const addToRecentSearches = (city: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, 5); // Keep only 5 recent searches
    });
  };

  const clearRecentSearch = (city: string) => {
    setRecentSearches(prev => prev.filter(c => c !== city));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleFavorite = (city: string) => {
    setFavorites(prev => {
      const exists = prev.some(c => c.toLowerCase() === city.toLowerCase());
      if (exists) {
        return prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      } else {
        return [...prev, city];
      }
    });
  };

  const isFavorite = (city: string) => {
    return favorites.some(c => c.toLowerCase() === city.toLowerCase());
  };

  const processWeatherData = (data: WeatherResponse): WeatherData => {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].description,
      feelsLike: data.main.feels_like,
      pressure: data.main.pressure,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  };

  const processForecastData = (data: ForecastResponse): ForecastData[] => {
    const dailyForecasts: { [key: string]: any[] } = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString();

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = [];
      }
      dailyForecasts[dateKey].push(item);
    });

    const days = Object.keys(dailyForecasts).slice(1, 4);

    return days.map((dateKey, index) => {
      const dayData = dailyForecasts[dateKey];
      const temps = dayData.map(d => d.main.temp);
      const conditions = dayData.map(d => d.weather[0].main);

      const conditionCounts: { [key: string]: number } = {};
      conditions.forEach(cond => {
        conditionCounts[cond] = (conditionCounts[cond] || 0) + 1;
      });
      const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      const date = new Date(dayData[0].dt * 1000);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = index === 0 ? 'Tomorrow' : dayNames[date.getDay()];

      return {
        date: dayName,
        condition: mostCommonCondition,
        tempHigh: Math.max(...temps),
        tempLow: Math.min(...temps),
      };
    });
  };

  const processHourlyData = (data: ForecastResponse): HourlyData[] => {
    return data.list.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      return {
        time: `${displayHours} ${ampm}`,
        temperature: item.main.temp,
        condition: item.weather[0].main,
      };
    });
  };

  const handleSearch = async (city: string) => {
    setError('');
    setLoading(true);

    try {
      const apiUnit = unit === 'C' ? 'metric' : 'imperial';
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeatherByCity(city, apiUnit),
        fetchForecast(city, apiUnit),
      ]);

      const processedWeather = processWeatherData(weatherResponse);
      setWeatherData(processedWeather);
      setForecastData(processForecastData(forecastResponse));
      setHourlyData(processHourlyData(forecastResponse));
      addToRecentSearches(processedWeather.city);
    } catch (err) {
      console.error('[App] Search failed:', err);
      setWeatherData(null);
      setForecastData([]);
      setHourlyData([]);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setError('');
    setDetectingLocation(true);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiUnit = unit === 'C' ? 'metric' : 'imperial';

          const [weatherResponse, forecastResponse] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude, apiUnit),
            fetchForecastByCoords(latitude, longitude, apiUnit),
          ]);

          const processedWeather = processWeatherData(weatherResponse);
          setWeatherData(processedWeather);
          setForecastData(processForecastData(forecastResponse));
          setHourlyData(processHourlyData(forecastResponse));
          addToRecentSearches(processedWeather.city);
        } catch (err) {
          setWeatherData(null);
          setForecastData([]);
          setHourlyData([]);
          setError(err instanceof Error ? err.message : 'Failed to fetch weather for your location.');
        } finally {
          setDetectingLocation(false);
          setLoading(false);
        }
      },
      (error) => {
        setDetectingLocation(false);
        setLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while detecting your location.');
        }
      }
    );
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);

    if (weatherData) {
      handleSearch(weatherData.city);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-orange-50 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 -z-10" />
      <Header
        unit={unit}
        onUnitToggle={handleUnitToggle}
        onShowFavorites={() => setShowFavoritesModal(true)}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              onLocationDetect={handleLocationDetect}
              isDetectingLocation={detectingLocation}
            />
          </div>

          <RecentSearches
            searches={recentSearches}
            onSelectSearch={handleSearch}
            onClearSearch={clearRecentSearch}
            onClearAll={clearAllRecentSearches}
          />

          {error && <ErrorMessage message={error} />}

          {loading && <LoadingSpinner />}

          {!loading && weatherData && (
            <div className="space-y-6">
              <WeatherCard
                data={weatherData}
                unit={unit}
                isFavorite={isFavorite(weatherData.city)}
                onToggleFavorite={() => toggleFavorite(weatherData.city)}
              />

              <WeatherDetails
                feelsLike={weatherData.feelsLike}
                pressure={weatherData.pressure}
                visibility={weatherData.visibility}
                sunrise={weatherData.sunrise}
                sunset={weatherData.sunset}
                unit={unit}
              />

              <WeatherTips
                condition={weatherData.condition}
                temperature={weatherData.temperature}
                humidity={weatherData.humidity}
                unit={unit}
              />

              {hourlyData.length > 0 && (
                <HourlyForecast data={hourlyData} unit={unit} />
              )}

              {forecastData.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-center text-2xl mb-6 text-gray-800">3-Day Forecast</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {forecastData.map((forecast, index) => (
                      <ForecastCard key={index} data={forecast} unit={unit} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!weatherData && !error && !loading && (
            <div className="text-center mt-16 space-y-8">
              <div>
                <h2 className="text-4xl mb-4 text-foreground">Welcome to ClimaNow</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Your trusted weather companion for accurate forecasts worldwide
                </p>
              </div>

              
              <div className="bg-gradient-to-r from-teal-50 to-orange-50 dark:from-teal-950 dark:to-orange-950 rounded-3xl p-6 max-w-2xl mx-auto border border-transparent dark:border-border">
                <p className="text-sm text-muted-foreground mb-4">Try searching for popular cities:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'].map(city => (
                    <button
                      key={city}
                      onClick={() => handleSearch(city)}
                      className="px-4 py-2 bg-background border-2 border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-400 rounded-full hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        onSelectCity={handleSearch}
        onRemoveFavorite={toggleFavorite}
      />
    </div>
  );
}
