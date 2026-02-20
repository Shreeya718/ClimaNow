import { Cloud, CloudRain, Sun, Wind, Droplets, CloudSnow, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

interface WeatherCardProps {
  data: WeatherData;
  unit: 'C' | 'F';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function WeatherCard({ data, unit, isFavorite, onToggleFavorite }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) {
      return <Sun className="w-24 h-24 text-orange-400" strokeWidth={1.5} />;
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
      return <CloudRain className="w-24 h-24 text-blue-400" strokeWidth={1.5} />;
    } else if (cond.includes('snow')) {
      return <CloudSnow className="w-24 h-24 text-blue-300" strokeWidth={1.5} />;
    } else {
      return <Cloud className="w-24 h-24 text-gray-400" strokeWidth={1.5} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8 bg-card text-card-foreground rounded-3xl shadow-xl p-8 relative border border-border"
    >
      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors group"
        aria-label="Toggle favorite"
      >
        <Heart
          className={`w-6 h-6 transition-all ${isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground group-hover:text-red-400'
            }`}
        />
      </motion.button>

      {/* City and Country */}
      <div className="text-center mb-6">
        <h2 className="text-3xl mb-1">{data.city}</h2>
        <p className="text-muted-foreground">{data.country}</p>
      </div>

      {/* Weather Icon and Temperature */}
      <div className="flex flex-col items-center justify-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {getWeatherIcon(data.condition)}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl mt-4 mb-2"
        >
          {Math.round(data.temperature)}°{unit}
        </motion.div>
        <p className="text-xl text-muted-foreground capitalize">{data.condition}</p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Humidity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-teal-950 dark:to-blue-950 rounded-2xl"
        >
          <Droplets className="w-8 h-8 text-teal-500" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-2xl">{data.humidity}%</p>
          </div>
        </motion.div>

        {/* Wind Speed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-2xl"
        >
          <Wind className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">Wind Speed</p>
            <p className="text-2xl">{Math.round(data.windSpeed)} {unit === 'C' ? 'km/h' : 'mph'}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}