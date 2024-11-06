import { fetchPrefectures } from '../../api/prefectures';

const mockFetch = global.fetch as jest.Mock;

describe('fetchPrefectures', () => {
    beforeEach(() => {
        global.fetch = jest.fn() as jest.Mock;
    });

    test('should fetch prefectures data successfully', async () => {
        const mockData = [{ code: 1, name: 'Tokyo' }, { code: 2, name: 'Osaka' }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData),
        });

        const result = await fetchPrefectures();
        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/prefectures'),
            expect.any(Object)
        );
    });

    test('should throw an error when fetch fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });

        await expect(fetchPrefectures()).rejects.toThrow('Failed to fetch prefectures: 404');
    });
});