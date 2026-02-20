import { Lightbulb } from 'lucide-react';

interface WeatherTipsProps {
  condition: string;
  temperature: number;
  humidity: number;
  unit: 'C' | 'F';
}

export function WeatherTips({ condition, temperature, humidity, unit }: WeatherTipsProps) {
  const getTips = (): string[] => {
    const tips: string[] = [];
    const cond = condition.toLowerCase();

    // Temperature-based tips
    if (unit === 'C') {
      if (temperature > 30) {
        tips.push('Stay hydrated! Drink plenty of water throughout the day.');
        tips.push('Wear light, breathable clothing and use sunscreen.');
      } else if (temperature < 10) {
        tips.push('Bundle up! Wear warm layers to stay comfortable.');
        tips.push('Don\'t forget your gloves and scarf if going outside.');
      } else if (temperature >= 20 && temperature <= 25) {
        tips.push('Perfect weather for outdoor activities!');
      }
    } else {
      if (temperature > 86) {
        tips.push('Stay hydrated! Drink plenty of water throughout the day.');
        tips.push('Wear light, breathable clothing and use sunscreen.');
      } else if (temperature < 50) {
        tips.push('Bundle up! Wear warm layers to stay comfortable.');
        tips.push('Don\'t forget your gloves and scarf if going outside.');
      } else if (temperature >= 68 && temperature <= 77) {
        tips.push('Perfect weather for outdoor activities!');
      }
    }

    // Condition-based tips
    if (cond.includes('rain')) {
      tips.push('Don\'t forget your umbrella and waterproof jacket!');
      tips.push('Drive carefully - roads may be slippery.');
    } else if (cond.includes('snow')) {
      tips.push('Drive slowly and maintain a safe distance from other vehicles.');
      tips.push('Wear insulated, waterproof boots for outdoor activities.');
    } else if (cond.includes('clear') || cond.includes('sun')) {
      tips.push('Great day for outdoor activities and vitamin D!');
      tips.push('Don\'t forget sunscreen if spending time outside.');
    } else if (cond.includes('cloud')) {
      tips.push('Good day for a walk - not too hot, not too cold!');
    }

    // Humidity-based tips
    if (humidity > 80) {
      tips.push('High humidity - stay in air-conditioned areas if possible.');
    } else if (humidity < 30) {
      tips.push('Low humidity - use moisturizer to prevent dry skin.');
    }

    return tips.slice(0, 3); // Return max 3 tips
  };

  const tips = getTips();

  if (tips.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-200 dark:border-yellow-900 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-orange-600 dark:text-yellow-500" />
          <h3 className="text-lg">Weather Tips</h3>
        </div>

        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-yellow-500 mt-1">•</span>
              <p className="text-muted-foreground text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
