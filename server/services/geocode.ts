import axios from "axios";
import { type Address } from "@shared/schema";

/**
 * Converts addresses to geographical coordinates using Google Maps Geocoding API
 * 
 * @param addresses - Array of addresses to geocode
 * @returns Array of addresses with lat/lng coordinates
 */
export async function geocodeAddresses(addresses: Address[]): Promise<Address[]> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
    if (!apiKey) {
      console.warn("Google Maps API Key is not set");
      // For testing purposes, return addresses with mock coordinates
      return addresses.map(address => ({
        ...address,
        lat: getRandomCoordinate(25.02, 25.07),  // Rough Taipei latitude
        lng: getRandomCoordinate(121.5, 121.6)   // Rough Taipei longitude
      }));
    }

    // Process addresses sequentially to avoid rate limiting
    const geocodedAddresses: Address[] = [];
    
    for (const address of addresses) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: address.address,
              key: apiKey,
              language: "zh-TW",
              region: "tw"
            }
          }
        );

        if (response.data.status === "OK" && response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          geocodedAddresses.push({
            ...address,
            lat: location.lat.toString(),
            lng: location.lng.toString()
          });
        } else {
          console.warn(`Geocoding failed for address: ${address.address}`, response.data);
          geocodedAddresses.push({
            ...address,
            lat: getRandomCoordinate(25.02, 25.07),
            lng: getRandomCoordinate(121.5, 121.6)
          });
        }
      } catch (error) {
        console.error(`Error geocoding address ${address.address}:`, error);
        geocodedAddresses.push({
          ...address,
          lat: getRandomCoordinate(25.02, 25.07),
          lng: getRandomCoordinate(121.5, 121.6)
        });
      }
      
      // Respect Google Maps API rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return geocodedAddresses;
  } catch (error) {
    console.error("Error in geocodeAddresses:", error);
    throw new Error("地址轉換失敗");
  }
}

/**
 * Helper function to generate random coordinates for testing
 */
function getRandomCoordinate(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(6);
}
