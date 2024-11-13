import { fetchPrefectures } from '@/api/prefectures';
import { Prefecture } from '@/components/types';

describe('fetchPrefectures', () => {
    const mockResponse: Prefecture[] = [
        { prefCode: 1, prefName: 'Hokkaido' },
        { prefCode: 2, prefName: 'Aomori' },
        { prefCode: 3, prefName: 'Iwate' },
    ];

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

    it('should fetch prefectures data successfully', async () => {
        const result = await fetchPrefectures();

        // APIコールの検証
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
            {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'undefined',
                },
            }
        );

        // レスポンスの検証
        expect(result).toEqual(mockResponse);
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

        await expect(fetchPrefectures()).rejects.toThrow(
            `Failed to fetch prefectures: ${errorStatus}`
        );

        expect(console.error).toHaveBeenCalledWith(
            'Error fetching prefectures:',
            expect.any(Error)
        );
    });

    it('should handle network errors', async () => {
        const networkError = new Error('Network error');
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(networkError)
        );

        await expect(fetchPrefectures()).rejects.toThrow('Network error');

        expect(console.error).toHaveBeenCalledWith(
            'Error fetching prefectures:',
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

        await expect(fetchPrefectures()).rejects.toThrow('Invalid JSON');

        expect(console.error).toHaveBeenCalledWith(
            'Error fetching prefectures:',
            expect.any(Error)
        );
    });

    // API KEYが未定義の場合のテスト
    it('should use undefined as API key when env variable is not set', async () => {
        const originalEnv = process.env.NEXT_PUBLIC_API_KEY;
        delete process.env.NEXT_PUBLIC_API_KEY;

        await fetchPrefectures();

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: {
                    'X-API-KEY': 'undefined'
                }
            })
        );

        process.env.NEXT_PUBLIC_API_KEY = originalEnv;
    });
});