/**
 * Formats a Google Maps URL for a route with multiple waypoints
 * 
 * @param addresses - Array of addresses with coordinates
 * @returns Formatted Google Maps URL
 */
export function formatGoogleMapsUrl(addresses: Array<{address: string, lat?: string, lng?: string}>): string {
  if (!addresses || addresses.length === 0) return '';
  
  // Base URL for Google Maps directions
  let url = 'https://www.google.com/maps/dir/';
  
  // Add each address to URL
  addresses.forEach(addr => {
    // Prefer coordinates if available, otherwise use address text
    const locationParam = (addr.lat && addr.lng) 
      ? `${addr.lat},${addr.lng}`
      : addr.address;
      
    url += `${encodeURIComponent(locationParam)}/`;
  });
  
  return url;
}

/**
 * Finds the center point for a set of coordinates
 * 
 * @param coordinates - Array of lat/lng pairs
 * @returns Center point {lat, lng}
 */
export function findCenterPoint(coordinates: Array<{lat: string, lng: string}>): {lat: number, lng: number} {
  if (!coordinates || coordinates.length === 0) {
    // Default to Taiwan center if no coordinates
    return { lat: 23.69781, lng: 120.96051 };
  }
  
  // Calculate average lat/lng
  let totalLat = 0;
  let totalLng = 0;
  
  coordinates.forEach(coord => {
    totalLat += parseFloat(coord.lat);
    totalLng += parseFloat(coord.lng);
  });
  
  return {
    lat: totalLat / coordinates.length,
    lng: totalLng / coordinates.length
  };
}

/**
 * Calculates approximate distance between two coordinates in kilometers
 * Using Haversine formula
 * 
 * @param lat1 - First point latitude
 * @param lng1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lng2 - Second point longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}
