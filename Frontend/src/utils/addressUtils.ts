import axios from "axios";

/**
 * Fetches City and State from a given 6-digit Indian Pincode.
 * Uses public API: postalpincode.in
 */
export const getAddressFromPincode = async (pincode: string) => {
  if (!pincode || pincode.length !== 6) return null;
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    if (response.data[0].Status === "Success") {
      const postOffice = response.data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State,
        country: "India"
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching pincode data:", error);
    return null;
  }
};

/**
 * Fetches real address from Latitude and Longitude.
 * Uses OpenStreetMap Nominatim API (Free)
 */
export const getAddressFromCoords = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (response.data && response.data.address) {
      const addr = response.data.address;
      return {
        addressLine1: response.data.display_name.split(",").slice(0, 2).join(", "),
        city: addr.city || addr.town || addr.village || addr.suburb || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        country: addr.country || "India"
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
};

/**
 * Browser-based Geolocation helper
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};

/**
 * Searches for locations by city or name.
 */
export const searchLocationByCity = async (query: string) => {
  if (!query || query.length < 3) return [];
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`
    );
    return response.data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error("Error searching location:", error);
    return [];
  }
};
