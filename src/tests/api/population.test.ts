import { fetchPopulation } from '../../api/population';

global.fetch = jest.fn();

describe('fetchPopulation', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch population data successfully', async () => {
        const mockData = {
            message: null,
            result: {
                label: 'Tokyo',
                data: [{ label: '2020', data: [{ year: 2020, value: 10000000 }] }],
            },
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData),
        });

        const result = await fetchPopulation(13);
        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/population/composition/perYear?prefCode=13'),
            expect.any(Object)
        );
    });

    test('should throw an error when fetch fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });

        await expect(fetchPopulation(13)).rejects.toThrow('Failed to fetch population: 404');
    });
});