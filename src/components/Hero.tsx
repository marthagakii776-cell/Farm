import React from 'react';
import { ArrowRight, Sprout, ShoppingCart, CloudSun, BookOpen } from 'lucide-react';

interface HeroProps {
  onExploreMarket: () => void;
  onOpenFarmManager: () => void;
  onOpenWeather: () => void;
  onOpenLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMarket,
  onOpenFarmManager,
  onOpenWeather,
  onOpenLearning,
}) => {
  return (
    <div className="relative bg-[#0E351F] text-white overflow-hidden">
      {/* Background Image with carefully calibrated contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_african_farm_1793644381257.jpg"
          alt="East African Highland Terraced Farmland at Golden Hour"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2717] via-[#0E351F]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-300 mb-4">
            <span>Direct Agricultural Trade & Farm Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Kenya & East Africa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight mb-5 text-balance">
            Growing Today, <br />
            <span className="text-emerald-300">Feeding the Future.</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-xl">
            Connecting farmers, certified buyers, agricultural input suppliers, and agronomy experts on a single unified platform. Direct produce sales, precision farm management, and live weather advisories.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreMarket}
              className="px-5 py-3 text-sm font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-lg transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Browse Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenFarmManager}
              className="px-5 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap backdrop-blur-sm"
            >
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Manage Farm Records</span>
            </button>

            <button
              onClick={onOpenWeather}
              className="px-4 py-3 text-sm font-medium text-emerald-200 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <CloudSun className="w-4 h-4 text-emerald-400" />
              <span>Live Weather Station</span>
            </button>
          </div>
        </div>

        {/* Full-width 4-metric strip below hero text */}
        <div className="mt-14 pt-8 border-t border-emerald-800/60 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              100%
            </div>
            <div className="text-xs text-emerald-200/80 mt-1">Direct Farmer-to-Buyer Sales</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-300">
              KSh 0
            </div>
            <div className="text-xs text-emerald-200/80 mt-1">Intermediary Broker Fees</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              9 Counties
            </div>
            <div className="text-xs text-emerald-200/80 mt-1">Active Agricultural Hubs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-300">
              Live API
            </div>
            <div className="text-xs text-emerald-200/80 mt-1">Open-Meteo Weather Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
};
