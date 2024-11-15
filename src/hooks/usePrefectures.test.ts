import { renderHook, waitFor } from '@testing-library/react';  // waitFor をここからインポート
import { usePrefectures } from '@/hooks/usePrefectures';  // フックのパスに合わせてください
import { fetchPrefectures } from '@/api/prefectures';

// モック設定
jest.mock('@/api/prefectures');

describe('usePrefectures', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });



    it('should fetch and set prefectures data successfully', async () => {
        // モックの戻り値設定
        const mockPrefectures = [
            { prefCode: 1, prefName: '北海道' },
            { prefCode: 2, prefName: '青森' },
        ];
        (fetchPrefectures as jest.Mock).mockResolvedValueOnce({ result: mockPrefectures });

        const { result } = renderHook(() => usePrefectures());

        // `waitFor` を使ってデータが設定されるのを待つ
        await waitFor(() => result.current.prefectures.length > 0);

        // データが正しく設定されているか確認
        expect(result.current.prefectures).toEqual(mockPrefectures);
        expect(result.current.error).toBeNull();
    });

    it('should handle error when fetching prefectures fails', async () => {
        // モックがエラーを返すように設定
        (fetchPrefectures as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

        const { result } = renderHook(() => usePrefectures());

        // `waitFor` を使ってエラーが設定されるのを待つ
        await waitFor(() => result.current.error !== null);

        // エラーメッセージが設定されているか確認
        expect(result.current.prefectures).toEqual([]);
        expect(result.current.error).toBe('Failed to fetch prefectures');
    });
});
