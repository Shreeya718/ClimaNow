import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';
import { motion } from 'motion/react';

interface ForecastData {
  date: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
}

interface ForecastCardProps {
  data: ForecastData;
  unit: 'C' | 'F';
}

export function ForecastCard({ data, unit }: ForecastCardProps) {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) {
      return <Sun className="w-12 h-12 text-orange-400" strokeWidth={1.5} />;
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
      return <CloudRain className="w-12 h-12 text-blue-400" strokeWidth={1.5} />;
    } else if (cond.includes('snow')) {
      return <CloudSnow className="w-12 h-12 text-blue-300" strokeWidth={1.5} />;
    } else {
      return <Cloud className="w-12 h-12 text-gray-400" strokeWidth={1.5} />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-card text-card-foreground border border-border rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <p className="text-center mb-4 text-foreground">{data.date}</p>
      <div className="flex justify-center mb-4">
        {getWeatherIcon(data.condition)}
      </div>
      <p className="text-center text-sm text-muted-foreground mb-2 capitalize">{data.condition}</p>
      <div className="flex justify-center gap-2">
        <span className="text-foreground">{Math.round(data.tempHigh)}°</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{Math.round(data.tempLow)}°</span>
      </div>
    </motion.div>
  );
}