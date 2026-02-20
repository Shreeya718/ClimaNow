import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
}

interface HourlyForecastProps {
  data: HourlyData[];
  unit: 'C' | 'F';
}

export function HourlyForecast({ data, unit }: HourlyForecastProps) {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) {
      return <Sun className="w-6 h-6 text-orange-400" strokeWidth={1.5} />;
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
      return <CloudRain className="w-6 h-6 text-blue-400" strokeWidth={1.5} />;
    } else if (cond.includes('snow')) {
      return <CloudSnow className="w-6 h-6 text-blue-300" strokeWidth={1.5} />;
    } else {
      return <Cloud className="w-6 h-6 text-gray-400" strokeWidth={1.5} />;
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h3 className="text-center text-2xl mb-6">Hourly Forecast</h3>

      <div className="bg-card text-card-foreground backdrop-blur-sm rounded-3xl shadow-lg p-6 overflow-x-auto border border-border">
        <div className="flex gap-4 min-w-max pb-2">
          {data.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-2xl min-w-[80px] hover:shadow-md transition-all duration-200"
            >
              <p className="text-sm text-muted-foreground">{hour.time}</p>
              <div className="my-1">
                {getWeatherIcon(hour.condition)}
              </div>
              <p className="text-lg">{Math.round(hour.temperature)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
