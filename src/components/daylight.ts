/* =========================================================
   daylight.ts — resolve light/dark from the visitor's local
   sunrise/sunset, derived from their IANA time zone.

   No network calls, no geolocation prompt: the browser's time
   zone gives us an approximate latitude/longitude, which is
   enough to compute solar times to within a few minutes.

   NOTE: index.html carries a condensed copy of this math in an
   inline script so the first paint already has the right theme.
   Keep the two in sync if the algorithm changes.
   ========================================================= */

import type { Theme } from './theme-context';

/** Approximate [latitude, longitude] for common IANA time zones. */
const ZONE_COORDS: Record<string, [number, number]> = {
  'Africa/Cairo': [30.0, 31.2],
  'Africa/Johannesburg': [-26.2, 28.0],
  'Africa/Lagos': [6.5, 3.4],
  'Africa/Nairobi': [-1.3, 36.8],
  'America/Anchorage': [61.2, -149.9],
  'America/Argentina/Buenos_Aires': [-34.6, -58.4],
  'America/Bogota': [4.7, -74.1],
  'America/Chicago': [41.9, -87.6],
  'America/Denver': [39.7, -105.0],
  'America/Halifax': [44.6, -63.6],
  'America/Lima': [-12.0, -77.0],
  'America/Los_Angeles': [34.1, -118.2],
  'America/Mexico_City': [19.4, -99.1],
  'America/New_York': [40.7, -74.0],
  'America/Phoenix': [33.4, -112.1],
  'America/Sao_Paulo': [-23.5, -46.6],
  'America/Santiago': [-33.5, -70.7],
  'America/Toronto': [43.7, -79.4],
  'America/Vancouver': [49.3, -123.1],
  'Asia/Bangkok': [13.8, 100.5],
  'Asia/Dubai': [25.2, 55.3],
  'Asia/Hong_Kong': [22.3, 114.2],
  'Asia/Jakarta': [-6.2, 106.8],
  'Asia/Jerusalem': [31.8, 35.2],
  'Asia/Kolkata': [22.6, 88.4],
  'Asia/Karachi': [24.9, 67.0],
  'Asia/Manila': [14.6, 121.0],
  'Asia/Seoul': [37.6, 127.0],
  'Asia/Shanghai': [31.2, 121.5],
  'Asia/Singapore': [1.4, 103.8],
  'Asia/Tokyo': [35.7, 139.7],
  'Australia/Brisbane': [-27.5, 153.0],
  'Australia/Melbourne': [-37.8, 145.0],
  'Australia/Perth': [-31.9, 115.9],
  'Australia/Sydney': [-33.9, 151.2],
  'Europe/Amsterdam': [52.4, 4.9],
  'Europe/Athens': [38.0, 23.7],
  'Europe/Belgrade': [44.8, 20.5],
  'Europe/Berlin': [52.5, 13.4],
  'Europe/Brussels': [50.8, 4.4],
  'Europe/Bucharest': [44.4, 26.1],
  'Europe/Budapest': [47.5, 19.0],
  'Europe/Copenhagen': [55.7, 12.6],
  'Europe/Dublin': [53.3, -6.3],
  'Europe/Helsinki': [60.2, 24.9],
  'Europe/Istanbul': [41.0, 29.0],
  'Europe/Lisbon': [38.7, -9.1],
  'Europe/London': [51.5, -0.1],
  'Europe/Madrid': [40.4, -3.7],
  'Europe/Moscow': [55.8, 37.6],
  'Europe/Oslo': [59.9, 10.8],
  'Europe/Paris': [48.9, 2.4],
  'Europe/Prague': [50.1, 14.4],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Sarajevo': [43.9, 18.4],
  'Europe/Sofia': [42.7, 23.3],
  'Europe/Stockholm': [59.3, 18.1],
  'Europe/Vienna': [48.2, 16.4],
  'Europe/Warsaw': [52.2, 21.0],
  'Europe/Zagreb': [45.8, 16.0],
  'Europe/Zurich': [47.4, 8.5],
  'Pacific/Auckland': [-36.9, 174.8],
  'Pacific/Honolulu': [21.3, -157.9],
};

/** Coarse latitude fallback per continent when the zone is unknown. */
const REGION_LATITUDE: Record<string, number> = {
  Africa: 5,
  America: 35,
  Antarctica: -70,
  Arctic: 78,
  Asia: 30,
  Atlantic: 35,
  Australia: -30,
  Europe: 50,
  Indian: -10,
  Pacific: -15,
};

const DEG = Math.PI / 180;

function timeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/**
 * Approximate visitor coordinates. Longitude falls back to the centre
 * meridian of their UTC offset, which is where the clock says they are.
 */
function visitorCoords(date: Date): { lat: number; lon: number } {
  const zone = timeZone();
  const known = ZONE_COORDS[zone];
  if (known) return { lat: known[0], lon: known[1] };

  const region = zone.split('/')[0];
  const lat = REGION_LATITUDE[region] ?? 40;
  const offsetHours = -date.getTimezoneOffset() / 60;
  return { lat, lon: offsetHours * 15 };
}

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return (current - start) / 86_400_000;
}

export interface DaylightWindow {
  theme: Theme;
  /** Local clock hours of sunrise/sunset; null during polar day/night. */
  sunrise: number | null;
  sunset: number | null;
}

/**
 * Sunrise/sunset in local clock hours for the visitor's date and place.
 * Standard NOAA approximation: solar declination + equation of time,
 * with a 90.833° zenith to account for atmospheric refraction.
 */
export function daylightWindow(date: Date = new Date()): DaylightWindow {
  const { lat, lon } = visitorCoords(date);
  const n = dayOfYear(date);
  const offsetHours = -date.getTimezoneOffset() / 60;

  const b = (360 / 365) * (n - 81) * DEG;
  const eqTimeMinutes = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.44 * DEG * Math.sin(b);

  const solarNoon = 12 - lon / 15 + offsetHours - eqTimeMinutes / 60;

  const cosHourAngle =
    (Math.cos(90.833 * DEG) - Math.sin(lat * DEG) * Math.sin(declination)) /
    (Math.cos(lat * DEG) * Math.cos(declination));

  const hours = date.getHours() + date.getMinutes() / 60;

  // Polar night / midnight sun: the sun never crosses the horizon today.
  if (cosHourAngle > 1) return { theme: 'dark', sunrise: null, sunset: null };
  if (cosHourAngle < -1) return { theme: 'light', sunrise: null, sunset: null };

  const hourAngle = Math.acos(cosHourAngle) / DEG / 15;
  const sunrise = solarNoon - hourAngle;
  const sunset = solarNoon + hourAngle;
  const isDay = hours >= sunrise && hours < sunset;

  return { theme: isDay ? 'light' : 'dark', sunrise, sunset };
}

/** Theme implied by daylight where the visitor is right now. */
export function resolveDaylightTheme(date: Date = new Date()): Theme {
  return daylightWindow(date).theme;
}

/**
 * Milliseconds until the theme would flip on its own, so `auto` can
 * re-evaluate exactly at sunrise/sunset instead of polling hard.
 * Capped at an hour to stay correct across DST and system clock changes.
 */
export function msUntilNextDaylightChange(date: Date = new Date()): number {
  const MAX = 60 * 60 * 1000;
  const { sunrise, sunset } = daylightWindow(date);
  if (sunrise === null || sunset === null) return MAX;

  const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const next = [sunrise, sunset, 24 + sunrise].find(h => h > hours);
  if (next === undefined) return MAX;

  return Math.min(MAX, Math.max(30_000, (next - hours) * 3_600_000));
}
