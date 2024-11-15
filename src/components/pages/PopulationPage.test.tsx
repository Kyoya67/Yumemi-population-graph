import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PopulationPage } from '@/components/pages/PopulationPage';
import { usePopulationData } from '@/hooks/usePopulationData';

// Create mock
jest.mock('@/hooks/usePopulationData');

// Dummy data for testing
const mockPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森' },
    { prefCode: 3, prefName: '岩手' },
    { prefCode: 4, prefName: '宮城' },
    { prefCode: 5, prefName: '秋田' },
];

const mockSelectedPrefectures = [
    {
        prefCode: 1,
        prefName: '北海道',
        data: [
            { year: 2020, value: 5000000 },
            { year: 2021, value: 4900000 }
        ]
    }
];

// Default mock data
const defaultMock = {
    prefectures: mockPrefectures,
    selectedPrefectures: [],
    populationType: '総人口',
    isLoading: false,
    error: null,
    handleCheckboxChange: jest.fn(),
    handlePopulationTypeChange: jest.fn(),
};

describe('PopulationPage', () => {
    beforeEach(() => {
        // Setting the default mock data
        (usePopulationData as jest.Mock).mockReturnValue(defaultMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly in initial state', () => {
        render(<PopulationPage />);
        expect(screen.getByRole('radio', { name: /総人口/i })).toBeVisible();
        expect(screen.getByLabelText('北海道')).toBeVisible();
    });

    it('displays error message correctly on error', () => {
        const errorMessage = 'Failed to retrieve data';
        (usePopulationData as jest.Mock).mockReturnValue({
            ...defaultMock,
            error: errorMessage,
        });

        render(<PopulationPage />);
        expect(screen.getByText(errorMessage)).toBeVisible();
    });

    it('displays graph when prefecture is selected', async () => {
        (usePopulationData as jest.Mock).mockReturnValue({
            ...defaultMock,
            selectedPrefectures: mockSelectedPrefectures,
        });

        render(<PopulationPage />);
        const graphElement = await screen.findByTestId('population-graph');
        expect(graphElement).toBeVisible();
    });

    it('handles checkbox changes correctly for any prefecture', () => {
        const handleCheckboxChange = jest.fn();
        (usePopulationData as jest.Mock).mockReturnValue({
            ...defaultMock,
            handleCheckboxChange,
        });

        render(<PopulationPage />);

        const randomPrefecture = mockPrefectures[Math.floor(Math.random() * mockPrefectures.length)];
        const checkbox = screen.getByLabelText(randomPrefecture.prefName);
        fireEvent.click(checkbox);

        expect(handleCheckboxChange).toHaveBeenCalledWith(
            randomPrefecture.prefCode,
            randomPrefecture.prefName,
            true,
        );
    });

    it('handles population type changes correctly', async () => {
        const handlePopulationTypeChange = jest.fn();
        (usePopulationData as jest.Mock).mockReturnValue({
            ...defaultMock,
            handlePopulationTypeChange,
        });

        render(<PopulationPage />);
        const radioButton = screen.getByRole('radio', { name: '年少人口' });
        fireEvent.click(radioButton);

        await waitFor(() => expect(handlePopulationTypeChange).toHaveBeenCalled());
    });

    it('applies disabled state correctly when loading', () => {
        (usePopulationData as jest.Mock).mockReturnValue({
            ...defaultMock,
            isLoading: true,
        });

        render(<PopulationPage />);

        const checkbox = screen.getByLabelText('北海道');
        expect(checkbox).toBeDisabled();

        const radioButton = screen.getByRole('radio', { name: /総人口/i });
        expect(radioButton).toBeDisabled();
    });
});
