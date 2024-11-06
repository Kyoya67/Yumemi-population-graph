const API_ENDPOINT = 'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'undefined';

export const fetchPrefectures = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/prefectures`, {
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prefectures: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prefectures:', error);
    throw error;
  }
};
