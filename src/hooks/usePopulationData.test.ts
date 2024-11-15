import { renderHook, act, waitFor } from '@testing-library/react';
import { usePopulationData } from '@/hooks/usePopulationData';
import { fetchPopulation } from '@/api/population';

jest.mock('@/api/population', () => ({
    fetchPopulation: jest.fn(),
}));

jest.mock('@/hooks/usePrefectures', () => ({
    usePrefectures: jest.fn().mockReturnValue({
        prefectures: [
            { prefCode: 1, prefName: '北海道' },
            { prefCode: 2, prefName: '青森県' }
        ],
        error: null,
    }),
}));

describe('usePopulationData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return correct initial state', async () => {
        const { result } = renderHook(() => usePopulationData());

        // 初期状態の確認
        expect(result.current.prefectures).toEqual([
            { prefCode: 1, prefName: '北海道' },
            { prefCode: 2, prefName: '青森県' }
        ]);
        expect(result.current.selectedPrefectures).toEqual([]);
        expect(result.current.populationType).toBe('総人口');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should add selected prefecture when checkbox is checked', async () => {
        // `fetchPopulation` のモックが返すデータを設定
        (fetchPopulation as jest.Mock).mockResolvedValueOnce({
            result: {
                data: [
                    { label: '総人口', data: [{ year: 2020, value: 1000000 }] },
                ],
            },
        });

        const { result } = renderHook(() => usePopulationData());

        // チェックボックスをチェック
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', true);
        });

        // `waitFor` を使って状態が更新されるのを待つ
        await waitFor(() => {
            expect(result.current.selectedPrefectures).toEqual([
                { prefName: '北海道', data: [{ year: 2020, value: 1000000 }] },
            ]);
        });
    });

    it('should remove selected prefecture when checkbox is unchecked', async () => {
        // 初期状態で '北海道' が選択されている状態を作る
        (fetchPopulation as jest.Mock).mockResolvedValueOnce({
            result: {
                data: [
                    { label: '総人口', data: [{ year: 2020, value: 1000000 }] },
                ],
            },
        });
        const { result } = renderHook(() => usePopulationData());

        // '北海道' を選択
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', true);
        });

        // チェックを外す
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', false);
        });

        // `waitFor` を使って状態が更新されるのを待つ
        await waitFor(() => {
            expect(result.current.selectedPrefectures).toEqual([]);
        });
    });

    it('should handle errors correctly when fetchPopulation fails', async () => {
        // `fetchPopulation` がエラーをスローするように設定
        (fetchPopulation as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

        const { result } = renderHook(() => usePopulationData());

        // チェックボックスをチェックしてエラーが発生することを確認
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', true);
        });

        // `waitFor` を使ってエラーが設定されるのを待つ
        await waitFor(() => {
            expect(result.current.error).toBe('Fetch error');
        });
    });

    it('should update selected prefectures when population type is changed', async () => {
        // 初期状態で '北海道' が選択されている状態を作る
        (fetchPopulation as jest.Mock).mockResolvedValue({
            result: {
                data: [
                    { label: '総人口', data: [{ year: 2020, value: 1000000 }] },
                    { label: '年少人口', data: [{ year: 2020, value: 550000 }] },
                ],
            },
        });

        const { result } = renderHook(() => usePopulationData());

        // '北海道' を選択
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', true);
        });

        // `年少人口` に切り替え
        await act(async () => {
            await result.current.handlePopulationTypeChange('年少人口');
        });

        // `waitFor` を使って選択されたデータが更新されるのを待つ
        await waitFor(() => {
            expect(result.current.selectedPrefectures).toEqual([
                {
                    prefName: '北海道',
                    data: [{ year: 2020, value: 550000 }],
                },
            ]);
        });
    });

    it('should handle errors when fetching new population type data', async () => {
        // `fetchPopulation` がエラーをスローするように設定
        (fetchPopulation as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

        const { result } = renderHook(() => usePopulationData());

        // チェックボックスをチェック
        await act(async () => {
            await result.current.handleCheckboxChange(1, '北海道', true);
        });

        // `年少人口` に切り替えてエラーが発生することを確認
        await act(async () => {
            await result.current.handlePopulationTypeChange('年少人口');
        });

        // `waitFor` を使ってエラーメッセージが設定されるのを待つ
        await waitFor(() => {
            expect(result.current.error).toBe('Fetch error');
        });
    });
});
