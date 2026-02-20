// OpenWeatherMap API Configuration
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Navigate to "API keys" section in your account
// 4. Copy your API key
// 5. Replace 'YOUR_API_KEY_HERE' below with your actual API key
//
// IMPORTANT SECURITY NOTE:
// In this demo app, the API key is stored in frontend code and will be visible to users.
// For production applications, API keys should NEVER be exposed in frontend code.
// Instead, use a backend server or services like Supabase to securely store and use API keys.
// 
// OpenWeatherMap's free tier allows 1,000 API calls per day, which is sufficient for testing.

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to get API key from environment
function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key || key === 'YOUR_API_KEY_HERE' || key === 'undefined') {
    throw new Error('API Configuration Error: Missing or invalid OpenWeatherMap API Key in .env file.');
  }
  return key;
}

// Simple in-memory cache
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  if (cache[url] && (now - cache[url].timestamp < CACHE_DURATION)) {
    console.log(`[Cache] Returning cached data for: ${url.split('&appid=')[0]}`);
    return cache[url].data;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[WeatherAPI] Fetch failed for ${url.split('&appid=')[0]} with status: ${response.status}`);
      if (response.status === 404) {
        throw new Error('City not found. Please check spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please ensure your key is correct and active (activation can take up to 2 hours).');
      } else if (response.status === 429) {
        throw new Error('API limit reached. Please try again later.');
      } else {
        throw new Error(`Weather data unavailable (Status: ${response.status}). Please try again later.`);
      }
    }

    const data = await response.json();
    cache[url] = { data, timestamp: now };
    return data;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('API Configuration') || error.message.includes('not found') || error.message.includes('Invalid API key'))) {
      throw error;
    }
    console.error('[WeatherAPI] Error:', error);
    throw new Error('Unable to connect to weather service. Please check your internet connection.');
  }
}

export interface WeatherResponse {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  visibility: number;
  dt: number;
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

// Fetch current weather by city name
export async function fetchWeatherByCity(city: string, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherResponse> {
  const key = getApiKey();
  return fetchWithCache<WeatherResponse>(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${key}`
  );
}

// Fetch current weather by coordinates
export async function fetchWeatherByCoords(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherResponse> {
  const key = getApiKey();
  return fetchWithCache<WeatherResponse>(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`
  );
}

// Fetch 5-day forecast
export async function fetchForecast(city: string, unit: 'metric' | 'imperial' = 'metric'): Promise<ForecastResponse> {
  const key = getApiKey();
  return fetchWithCache<ForecastResponse>(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${key}`
  );
}

// Fetch 5-day forecast by coordinates
export async function fetchForecastByCoords(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric'): Promise<ForecastResponse> {
  const key = getApiKey();
  return fetchWithCache<ForecastResponse>(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`
  );
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9 / 5) + 32);
}

// Convert Fahrenheit to Celsius
export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}