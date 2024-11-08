import { PopulationResponse } from '@/components/types';

const API_ENDPOINT = 'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'undefined';

export const fetchPopulation = async (prefCode: number): Promise<PopulationResponse> => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/population/composition/perYear?prefCode=${prefCode.toString()}`,
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch population: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching population:', error);
    throw error;
  }
};