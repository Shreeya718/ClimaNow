import { Clock, X } from 'lucide-react';

interface RecentSearchesProps {
  searches: string[];
  onSelectSearch: (city: string) => void;
  onClearSearch: (city: string) => void;
  onClearAll: () => void;
}

export function RecentSearches({ searches, onSelectSearch, onClearSearch, onClearAll }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="bg-card text-card-foreground backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Recent Searches</span>
          </div>
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {searches.map((city, index) => (
            <button
              key={index}
              className="group flex items-center gap-2 px-3 py-1.5 bg-background text-foreground border border-border rounded-full hover:border-teal-400 hover:bg-accent transition-all duration-200"
              onClick={() => onSelectSearch(city)}
            >
              <span className="text-sm">{city}</span>
              <X
                className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearSearch(city);
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
