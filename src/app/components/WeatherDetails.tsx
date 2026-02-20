import { Sunrise, Sunset, Eye, Gauge, ThermometerSun } from 'lucide-react';

interface WeatherDetailsProps {
  feelsLike: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  unit: 'C' | 'F';
}

export function WeatherDetails({ feelsLike, pressure, visibility, sunrise, sunset, unit }: WeatherDetailsProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const visibilityKm = Math.round(visibility / 1000);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-card text-card-foreground backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-border">
        <h3 className="text-lg mb-4 text-center">Additional Details</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Feels Like */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-xl">
            <ThermometerSun className="w-6 h-6 text-orange-500 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Feels Like</p>
              <p className="text-lg">{Math.round(feelsLike)}°{unit}</p>
            </div>
          </div>

          {/* Pressure */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl">
            <Gauge className="w-6 h-6 text-purple-500 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-lg">{pressure} hPa</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
            <Eye className="w-6 h-6 text-blue-500 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-lg">{visibilityKm} km</p>
            </div>
          </div>

          {/* Sunrise */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl md:col-span-1">
            <Sunrise className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="text-sm">{formatTime(sunrise)}</p>
            </div>
          </div>

          {/* Sunset */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl md:col-span-2">
            <Sunset className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="text-sm">{formatTime(sunset)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
