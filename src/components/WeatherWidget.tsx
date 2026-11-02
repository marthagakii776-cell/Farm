import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/index.ts';
import {
  KENYA_FARM_LOCATIONS,
  LocationOption,
  fetchLiveWeather,
} from '../services/weather.ts';
import {
  CloudSun,
  Wind,
  Droplets,
  CloudRain,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sun,
  ShieldAlert,
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(KENYA_FARM_LOCATIONS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isUsingGps, setIsUsingGps] = useState<boolean>(false);

  const loadWeather = async (loc: LocationOption) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchLiveWeather(
        loc.latitude,
        loc.longitude,
        loc.name,
        loc.region
      );
      setWeather(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError('Unable to fetch live weather data. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoading(true);
    setIsUsingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          const data = await fetchLiveWeather(lat, lon, 'Your GPS Farm Coordinates', 'Local Region');
          setWeather(data);
          setError('');
        } catch {
          setError('Could not retrieve weather for your coordinates.');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        setIsUsingGps(false);
        setError('Location permission denied or unavailable. Please pick a preset county.');
      }
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Real-Time Meteorological Station
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
            Agricultural Weather Forecast & Advisories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Live satellite & meteorological feed powered by Open-Meteo. Precision atmospheric metrics tailored for spraying, harvesting, and blight management.
          </p>
        </div>

        {/* Location Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLocation.name}
            onChange={(e) => {
              const found = KENYA_FARM_LOCATIONS.find((l) => l.name === e.target.value);
              if (found) {
                setIsUsingGps(false);
                setSelectedLocation(found);
              }
            }}
            className="px-3 py-2 text-xs font-medium bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-xs"
          >
            {KENYA_FARM_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name} · {loc.region}
              </option>
            ))}
          </select>

          <button
            onClick={handleUseGps}
            title="Detect GPS Location"
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isUsingGps
                ? 'bg-emerald-800 text-white border-emerald-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Use My GPS</span>
          </button>

          <button
            onClick={() => loadWeather(selectedLocation)}
            className="p-2 bg-white text-stone-600 hover:text-emerald-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Weather Overview */}
      {weather && (
        <div className="space-y-6">
          {/* Hero Weather Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#124227] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{weather.city}</span>
                  <span aria-hidden="true">·</span>
                  <span>{weather.region}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {weather.latitude}°N, {weather.longitude}°E
                  </span>
                </div>

                <div className="flex items-baseline gap-4">
                  <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight tabular-nums">
                    {weather.temperature}°C
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-emerald-100">
                      {weather.weatherDescription}
                    </div>
                    <div className="text-xs text-emerald-200 font-mono">
                      Feels like {weather.apparentTemperature}°C
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-emerald-700/60 pt-4 md:pt-0 md:pl-8">
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 mb-1">
                    <Droplets className="w-4 h-4 text-emerald-400" />
                    <span>Humidity</span>
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-white">
                    {weather.humidity}%
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 mb-1">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Wind Speed</span>
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-white">
                    {weather.windSpeed} km/h
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 mb-1">
                    <CloudRain className="w-4 h-4 text-emerald-400" />
                    <span>Rain Prob.</span>
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-white">
                    {weather.precipitationProbability}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Farming Weather Advisories */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-800" />
                Agronomic Field Advisories for Today
              </h3>
              <span className="text-[11px] text-stone-400">Based on live microclimate metrics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {weather.farmingAdvisories.map((advisory, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/50 flex items-start gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-stone-700 leading-relaxed font-medium">{advisory}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              7-Day Agricultural Outlook
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {weather.dailyForecast.map((day, idx) => (
                <div
                  key={day.date}
                  className={`p-3 rounded-lg border text-center flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-emerald-50/70 border-emerald-300 font-medium'
                      : 'bg-stone-50/50 border-stone-100'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-stone-800">{day.dayName}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {day.date.substring(5)}
                    </div>
                  </div>

                  <div className="my-3">
                    <CloudSun className="w-6 h-6 mx-auto text-emerald-800" />
                    <div className="text-[11px] text-stone-600 line-clamp-1 mt-1 font-medium">
                      {day.description}
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-2">
                    <div className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                      {day.maxTemp}° / {day.minTemp}°
                    </div>
                    <div className="text-[10px] text-emerald-800 font-mono mt-0.5 flex items-center justify-center gap-0.5">
                      <CloudRain className="w-2.5 h-2.5" />
                      {day.precipitationProb}% rain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
