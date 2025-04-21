import { get } from "./api";

export async function getRates() {
  
  try {
    const response = await get("/rates");

    if (response.data && response.data.success) {
      return response.data.rates; 
    } else {
      console.error("Error: API did not return success or quotes.");
      return {}; 
    }
  } catch (error) {
    console.error("Error fetching rates:", error);
    return {}; 
  }
}
