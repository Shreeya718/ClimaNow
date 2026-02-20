import { X, Heart, MapPin } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onSelectCity: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
}

export function FavoritesModal({ isOpen, onClose, favorites, onSelectCity, onRemoveFavorite }: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-400 to-orange-400 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" fill="currentColor" />
              <h2 className="text-2xl">Favorite Cities</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No favorite cities yet</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Click the heart icon on a weather card to add favorites
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((city, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-foreground">{city}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-full"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
