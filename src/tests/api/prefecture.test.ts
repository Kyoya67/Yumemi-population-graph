import { fetchPrefectures } from '@/api/prefectures';

describe('fetchPrefectures', () => {
    const mockResponse = [
        { prefCode: 1, prefName: 'Hokkaido' },
        { prefCode: 2, prefName: 'Aomori' },
        { prefCode: 3, prefName: 'Iwate' },
    ];

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

    it('should fetch prefectures data successfully', async () => {
        const result = await fetchPrefectures();
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
            'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
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

        await expect(fetchPrefectures()).rejects.toThrow('Failed to fetch prefectures: 404');
    });
});
