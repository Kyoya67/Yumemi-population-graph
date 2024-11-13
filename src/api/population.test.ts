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

    // console.errorをモック化
    const originalConsoleError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // fetchのモック化
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
        (console.error as jest.Mock).mockClear();
    });

    it('should fetch population data successfully', async () => {
        const result = await fetchPopulation(mockPrefCode);

        // APIコールの検証
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${mockPrefCode}`,
            {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'undefined',
                },
            }
        );

        // レスポンスの検証
        expect(result).toEqual(mockResponse);

        // エラーログが出力されていないことを確認
        expect(console.error).not.toHaveBeenCalled();
    });

    it('should throw an error when response is not ok', async () => {
        const errorStatus = 404;
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: errorStatus,
                statusText: 'Not Found'
            })
        );

        // エラーがスローされることを確認
        await expect(fetchPopulation(mockPrefCode)).rejects.toThrow(
            `Failed to fetch population: ${errorStatus}`
        );

        // エラーログの出力を確認
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching population:',
            expect.any(Error)
        );
    });

    it('should handle network errors', async () => {
        const networkError = new Error('Network error');
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(networkError)
        );

        await expect(fetchPopulation(mockPrefCode)).rejects.toThrow('Network error');

        expect(console.error).toHaveBeenCalledWith(
            'Error fetching population:',
            networkError
        );
    });

    it('should handle malformed JSON response', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON'))
            })
        );

        await expect(fetchPopulation(mockPrefCode)).rejects.toThrow('Invalid JSON');

        expect(console.error).toHaveBeenCalledWith(
            'Error fetching population:',
            expect.any(Error)
        );
    });
});