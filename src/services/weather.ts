import { WeatherData } from '../types/index.ts';

export interface LocationOption {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  specialty: string;
}

export const KENYA_FARM_LOCATIONS: LocationOption[] = [
  {
    name: 'Nakuru (Njoro / Rongai)',
    region: 'Rift Valley Highlands',
    latitude: -0.3031,
    longitude: 36.08,
    elevationM: 1850,
    specialty: 'Grain Maize, Wheat, Hass Avocados & Dairy',
  },
  {
    name: 'Eldoret (Uasin Gishu)',
    region: 'North Rift Grain Belt',
    latitude: 0.5143,
    longitude: 35.2698,
    elevationM: 2090,
    specialty: 'Commercial Maize, Seed Production & Dairy',
  },
  {
    name: 'Nairobi (Kiambu & Environs)',
    region: 'Central Urban / Peri-Urban',
    latitude: -1.2921,
    longitude: 36.8219,
    elevationM: 1680,
    specialty: 'Horticulture, Poultry & Hydroponics',
  },
  {
    name: 'Nyeri (Mount Kenya Slopes)',
    region: 'Central Highlands',
    latitude: -0.4201,
    longitude: 36.9476,
    elevationM: 1750,
    specialty: 'Coffee, Tea, Macadamia & Trout',
  },
  {
    name: 'Meru (Mount Kenya East)',
    region: 'Eastern Highlands',
    latitude: 0.0463,
    longitude: 37.6559,
    elevationM: 1580,
    specialty: 'Hass Avocados, Bananas, French Beans & Miraa',
  },
  {
    name: 'Kitale (Trans Nzoia)',
    region: 'Western Grain Basket',
    latitude: 1.0167,
    longitude: 35.0,
    elevationM: 1900,
    specialty: 'High-Yield Hybrid Maize & Sunflower',
  },
  {
    name: 'Kisumu (Lake Basin)',
    region: 'Western Lowlands',
    latitude: -0.0917,
    longitude: 34.768,
    elevationM: 1130,
    specialty: 'Rice, Sugarcane, Fish Farming & Sorghum',
  },
  {
    name: 'Machakos (Eastern)',
    region: 'Semi-Arid Lowlands',
    latitude: -1.5177,
    longitude: 37.2634,
    elevationM: 1138,
    specialty: 'Drought-Tolerant Sorghum, Pigeon Peas & Mangoes',
  },
  {
    name: 'Mombasa (Coast)',
    region: 'Coastal Plains',
    latitude: -4.0435,
    longitude: 39.6682,
    elevationM: 17,
    specialty: 'Coconuts, Cashew Nuts, Cassava & Pineapples',
  },
];

const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  cityName: string = 'Current Location',
  regionName: string = 'Local Region'
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo weather API responded with status ${res.status}`);
  }

  const data = await res.json();
  const current = data.current;
  const daily = data.daily;

  const temp = Math.round(current.temperature_2m);
  const humidity = Math.round(current.relative_humidity_2m);
  const wind = Math.round(current.wind_speed_10m);
  const precip = current.precipitation || 0;
  const weatherCode = current.weather_code;
  const weatherDesc = WMO_CODE_MAP[weatherCode] || 'Partly cloudy';

  // Compute domain-accurate agricultural weather advisories
  const advisories: string[] = [];

  // Spraying window advisory
  if (wind < 15 && precip === 0 && weatherCode < 60) {
    advisories.push(
      'Optimal Foliar Spraying Window: Gentle winds (<15 km/h) and zero precipitation ensure high absorption without drift.'
    );
  } else if (wind >= 15) {
    advisories.push(
      'Foliar Spraying Warning: Elevated wind speeds detected. Postpone pesticide/fungicide spraying to prevent drift wastage.'
    );
  }

  // Fungal & Blight risk advisory
  if (humidity > 80 && temp >= 14 && temp <= 25) {
    advisories.push(
      'High Fungal & Late Blight Risk: High humidity (>80%) creates favorable conditions for foliar blight in potatoes & tomatoes. Inspect crops promptly.'
    );
  }

  // Grain drying & harvesting
  if (precip === 0 && (weatherCode === 0 || weatherCode === 1 || weatherCode === 2)) {
    advisories.push(
      'Excellent Grain & Hay Curing: Low cloud cover enables rapid open-air moisture reduction for harvested maize, beans, and lucerne.'
    );
  } else if (precip > 2 || (daily.precipitation_probability_max[0] || 0) > 60) {
    advisories.push(
      'Rain Alert: High chance of precipitation today. Move bagged produce to covered storage and check field drainage trenches.'
    );
  }

  // Irrigation planning
  if (daily.precipitation_probability_max.slice(0, 3).every((p: number) => p < 25)) {
    advisories.push(
      'Dry Spell Forecast: Low rainfall probability over next 72 hours. Maintain scheduled drip irrigation schedules for shallow-rooted horticulture.'
    );
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dailyForecast = (daily.time || []).map((dateStr: string, idx: number) => {
    const d = new Date(dateStr);
    const code = daily.weather_code[idx] ?? 0;
    return {
      date: dateStr,
      dayName: idx === 0 ? 'Today' : daysOfWeek[d.getDay()],
      maxTemp: Math.round(daily.temperature_2m_max[idx]),
      minTemp: Math.round(daily.temperature_2m_min[idx]),
      precipitationProb: daily.precipitation_probability_max[idx] ?? 0,
      weatherCode: code,
      description: WMO_CODE_MAP[code] || 'Partly cloudy',
    };
  });

  return {
    city: cityName,
    region: regionName,
    latitude,
    longitude,
    temperature: temp,
    apparentTemperature: Math.round(current.apparent_temperature),
    humidity,
    windSpeed: wind,
    precipitationProbability: daily.precipitation_probability_max[0] || 0,
    weatherCode,
    weatherDescription: weatherDesc,
    isDay: current.is_day === 1,
    dailyForecast,
    farmingAdvisories: advisories,
  };
}
