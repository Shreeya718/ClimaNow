import { CloudSun } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-card text-card-foreground py-6 px-6 mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Branding */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <CloudSun className="w-5 h-5 text-teal-400" strokeWidth={1.5} />
          <span className="text-lg">ClimaNow</span>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>© 2026 ClimaNow. Your trusted weather companion.</p>
          <p className="mt-1 text-xs">Powered by OpenWeatherMap API</p>
        </div>
      </div>
    </footer>
  );
}