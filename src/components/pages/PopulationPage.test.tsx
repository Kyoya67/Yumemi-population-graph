import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PopulationPage } from '@/components/pages/PopulationPage';
import { usePopulationData } from '@/hooks/usePopulationData';

// usePopulationData フックのモック
jest.mock('@/hooks/usePopulationData', () => ({
    usePopulationData: jest.fn(),
}));

describe('PopulationPage', () => {
    it('renders the loading state correctly', () => {
        // モックを設定：isLoadingがtrue、他のデータはダミー
        (usePopulationData as jest.Mock).mockReturnValue({
            prefectures: [],
            selectedPrefectures: [],
            populationType: '総人口',
            isLoading: true,
            error: null,
            handleCheckboxChange: jest.fn(),
            handlePopulationTypeChange: jest.fn(),
        });

        render(<PopulationPage />);

        // isLoading が true の場合、ローディング表示されるかを確認
        expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    });

    it('renders the error message correctly', () => {
        // モックを設定：エラーが発生した場合
        (usePopulationData as jest.Mock).mockReturnValue({
            prefectures: [],
            selectedPrefectures: [],
            populationType: '総人口',
            isLoading: false,
            error: 'Failed to load data',
            handleCheckboxChange: jest.fn(),
            handlePopulationTypeChange: jest.fn(),
        });

        render(<PopulationPage />);

        // エラーが表示されているか確認
        expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('renders the PopulationTypeSelector, PrefectureCheckboxGroup, and PopulationGraph when data is loaded', async () => {
        // モックを設定：正常にデータがロードされている場合
        (usePopulationData as jest.Mock).mockReturnValue({
            prefectures: [{ prefCode: 1, prefName: 'Tokyo' }],
            selectedPrefectures: [
                {
                    prefName: 'Tokyo',
                    data: [
                        { year: 2000, value: 12000000 },
                        { year: 2005, value: 13000000 },
                    ],
                },
            ],
            populationType: '総人口',
            isLoading: false,
            error: null,
            handleCheckboxChange: jest.fn(),
            handlePopulationTypeChange: jest.fn(),
        });

        render(<PopulationPage />);

        // PopulationTypeSelector, PrefectureCheckboxGroup, PopulationGraph がレンダリングされるか確認
        expect(screen.getByText('総人口')).toBeInTheDocument(); // PopulationTypeSelector
        expect(screen.getByText('Tokyo')).toBeInTheDocument(); // PrefectureCheckboxGroup
        expect(screen.getByText('総人口の推移')).toBeInTheDocument(); // PopulationGraph タイトル

        // チェックボックスのクリックをシミュレートして選択
        fireEvent.click(screen.getByLabelText('Tokyo'));
        await waitFor(() => {
            expect(screen.getByText('Tokyo')).toBeInTheDocument(); // チェックボックスが選択されると、PopulationGraphが表示される
        });
    });

    it('does not render PopulationGraph if no prefectures are selected', () => {
        // モックを設定：選択された都道府県がない
        (usePopulationData as jest.Mock).mockReturnValue({
            prefectures: [{ prefCode: 1, prefName: 'Tokyo' }],
            selectedPrefectures: [],
            populationType: '総人口',
            isLoading: false,
            error: null,
            handleCheckboxChange: jest.fn(),
            handlePopulationTypeChange: jest.fn(),
        });

        render(<PopulationPage />);

        // PopulationGraph は表示されないことを確認
        expect(screen.queryByText('総人口の推移')).toBeNull();
    });
});
