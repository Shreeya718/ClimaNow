import { CloudSun, Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  unit: 'C' | 'F';
  onUnitToggle: () => void;
  onShowFavorites: () => void;
  favoritesCount: number;
}

export function Header({ unit, onUnitToggle, onShowFavorites, favoritesCount }: HeaderProps) {
  return (
    <header className="w-full bg-gradient-to-r from-teal-400 via-teal-500 to-orange-400 py-4 px-6 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <CloudSun className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={1.5} />
          <h1 className="text-white text-2xl tracking-wide drop-shadow-md">ClimaNow</h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Favorites Button */}
          <button
            onClick={onShowFavorites}
            className="relative hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
            aria-label="View favorite cities"
          >
            <Heart className="w-5 h-5" fill={favoritesCount > 0 ? "currentColor" : "none"} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Unit Toggle */}
          <button
            onClick={onUnitToggle}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
            aria-label="Toggle temperature unit"
          >
            <span className={unit === 'C' ? 'font-bold' : 'opacity-70'}>°C</span>
            <span className="opacity-50">|</span>
            <span className={unit === 'F' ? 'font-bold' : 'opacity-70'}>°F</span>
          </button>
        </div>
      </div>
    </header>
  );
}