import { fetchPopulation } from '@/api/population';
import { PopulationData } from '@/components/types';

describe('fetchPopulation', () => {
    const mockPrefCode = 1;
    const mockResponse: PopulationData = {
        prefName: 'Tokyo',
        data: [
            { year: 2020, value: 100000 },
            { year: 2021, value: 101000 },
        ],
    };

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch population data successfully', async () => {
        const result = await fetchPopulation(mockPrefCode);
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
            `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${mockPrefCode}`,
            {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'undefined',
                },
            }
        );
    });

    it('should throw an error when response is not ok', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({ ok: false, status: 404 })
        );

        await expect(fetchPopulation(mockPrefCode)).rejects.toThrow('Failed to fetch population: 404');
    });
});