/**
 * Distance calculation utilities using the Haversine formula
 *
 * The Haversine formula calculates the great-circle distance between
 * two points on a sphere given their latitudes and longitudes.
 */

/**
 * Coordinate interface
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Earth's radius in kilometers
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the great-circle distance between two coordinates using the Haversine formula
 *
 * @param from - Starting coordinates
 * @param to - Ending coordinates
 * @returns Distance in kilometers
 *
 * Formula:
 * a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
 * c = 2 * atan2(√a, √(1−a))
 * d = R * c
 *
 * Where:
 * - lat1, lat2 are latitudes in radians
 * - Δlat is the difference in latitudes
 * - Δlon is the difference in longitudes
 * - R is Earth's radius (6371 km)
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate distance between two coordinate pairs
 * Convenience function that accepts latitude/longitude directly
 *
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return calculateDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );
}

/**
 * Find the nearest coordinate from a list of candidates
 *
 * @param from - Starting coordinates
 * @param candidates - Array of candidate coordinates
 * @returns The nearest candidate and its distance
 */
export function findNearest<T extends Coordinates>(
  from: Coordinates,
  candidates: T[]
): { nearest: T; distance: number } | null {
  if (candidates.length === 0) {
    return null;
  }

  let nearest = candidates[0];
  let minDistance = calculateDistance(from, nearest);

  for (const candidate of candidates) {
    const distance = calculateDistance(from, candidate);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = candidate;
    }
  }

  return { nearest, distance: minDistance };
}

/**
 * Sort an array of coordinates by distance from a reference point
 *
 * @param from - Reference coordinates
 * @param candidates - Array of items with coordinates
 * @returns Array of items with distance property, sorted by nearest first
 */
export function sortByDistance<T extends Coordinates>(
  from: Coordinates,
  candidates: T[]
): Array<T & { distance: number }> {
  return candidates
    .map((item) => ({
      ...item,
      distance: calculateDistance(from, item),
    }))
    .sort((a, b) => a.distance - b.distance);
}
