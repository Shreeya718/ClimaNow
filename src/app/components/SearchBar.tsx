import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationDetect: () => void;
  isDetectingLocation: boolean;
}

export function SearchBar({ onSearch, onLocationDetect, isDetectingLocation }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-6 py-4 rounded-full bg-card text-card-foreground border-2 border-border focus:border-teal-400 focus:outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground"
            aria-label="City name"
          />
        </div>
        <button
          type="button"
          onClick={onLocationDetect}
          disabled={isDetectingLocation}
          className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Detect current location"
          title="Use my location"
        >
          <MapPin className={`w-5 h-5 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
        </button>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-200 flex items-center gap-2"
          aria-label="Search weather"
        >
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}