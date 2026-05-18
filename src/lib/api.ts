import rawSpaces from "../data/properties.json";

export async function apiFetch(endpoint: string): Promise<any> {
  console.log("Mock API call to:", endpoint);
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 150));
  
  const stored = localStorage.getItem("bunkie_spaces_data");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse spaces data in apiFetch", e);
    }
  }
  return rawSpaces;
}
