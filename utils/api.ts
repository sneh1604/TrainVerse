const apiKeysString = process.env.EXPO_PUBLIC_API_KEYS;
const API_KEYS = apiKeysString ? apiKeysString.split(',') : [];

if (API_KEYS.length === 0) {
  console.error("API keys are not configured. Please check your .env file and ensure it's named .env and in the root directory.");
}

let currentKeyIndex = 0;

/**
 * Fetches data from the RapidAPI IRCTC endpoint with key rotation.
 * @param endpoint The API endpoint to fetch from (e.g., '/api/v1/searchTrain?query=190').
 * @returns A promise that resolves with the JSON response.
 * @throws An error if all API keys fail.
 */
export const fetchFromRapidAPI = async (url: string) => {
  const MAX_RETRIES = API_KEYS.length;
  const urlObject = new URL(url);
  const host = urlObject.host;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const apiKey = API_KEYS[currentKeyIndex];
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': host,
          'x-rapidapi-key': apiKey,
        },
      });

      if (!response.ok) {
        // Handle non-2xx responses
        console.error(`API request failed with status ${response.status} for key ${apiKey.substring(0, 8)}...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        continue;
      }

      const data = await response.json();

      // If quota is exceeded for the current key, rotate and retry
      if (data.message && data.message.includes('exceeded')) {
        console.warn(`API key ${apiKey.substring(0, 8)}... quota exceeded. Trying next key.`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        continue; // Go to the next iteration to try the next key
      }

      // If successful, return a structured success response
      return { success: true, data };

    } catch (error) {
      console.error(`Fetch failed with key ${apiKey.substring(0, 8)}...`, error);
      // Rotate key on network error and retry
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    }
  }

  // This part is reached only if all keys have failed
  console.error('All API keys failed or have exceeded their quotas.');
  return { success: false, data: null };
};
