import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrefectureCheckboxGroup } from './PrefectureCheckboxGroup';
import { Prefecture } from '@/components/types';

describe('PrefectureCheckboxGroup', () => {
    const mockPrefectures: Prefecture[] = [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 13, prefName: '東京都' },
        { prefCode: 27, prefName: '大阪府' }
    ];

    const mockOnPrefectureChange = jest.fn();

    beforeEach(() => {
        mockOnPrefectureChange.mockClear();
    });

    describe('Rendering', () => {
        it('renders all prefecture checkboxes', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            mockPrefectures.forEach(pref => {
                const checkbox = screen.getByLabelText(pref.prefName);
                expect(checkbox).toBeInTheDocument();
                expect(checkbox).not.toBeChecked();
            });
        });

        it('renders with correct HTML attributes', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            mockPrefectures.forEach(pref => {
                const checkbox = screen.getByLabelText(pref.prefName);
                expect(checkbox).toHaveAttribute('type', 'checkbox');
            });
        });

        it('renders empty state when no prefectures provided', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={[]}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onPrefectureChange when checkbox is clicked', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            const checkbox = screen.getByLabelText('北海道');
            fireEvent.click(checkbox);
            expect(mockOnPrefectureChange).toHaveBeenCalledWith(1, '北海道', true);

            fireEvent.click(checkbox);
            expect(mockOnPrefectureChange).toHaveBeenCalledWith(1, '北海道', false);
        });

        it('handles multiple checkbox selections and deselections', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            const hokkaido = screen.getByLabelText('北海道');
            const tokyo = screen.getByLabelText('東京都');

            fireEvent.click(hokkaido);
            fireEvent.click(tokyo);
            fireEvent.click(hokkaido);

            expect(mockOnPrefectureChange).toHaveBeenCalledTimes(3);
            expect(mockOnPrefectureChange).toHaveBeenNthCalledWith(1, 1, '北海道', true);
            expect(mockOnPrefectureChange).toHaveBeenNthCalledWith(2, 13, '東京都', true);
            expect(mockOnPrefectureChange).toHaveBeenNthCalledWith(3, 1, '北海道', false);
        });
    });

    describe('Disabled state', () => {
        it('disables all checkboxes when disabled prop is true', () => {
            render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={true}
                />
            );

            mockPrefectures.forEach(pref => {
                const checkbox = screen.getByLabelText(pref.prefName);
                expect(checkbox).toBeDisabled();

                fireEvent.click(checkbox);
                expect(mockOnPrefectureChange).not.toHaveBeenCalled();
            });
        });

        it('enables checkboxes when disabled prop changes from true to false', () => {
            const { rerender } = render(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={true}
                />
            );

            rerender(
                <PrefectureCheckboxGroup
                    prefectures={mockPrefectures}
                    onPrefectureChange={mockOnPrefectureChange}
                    disabled={false}
                />
            );

            mockPrefectures.forEach(pref => {
                expect(screen.getByLabelText(pref.prefName)).not.toBeDisabled();
            });
        });
    });

    it('matches snapshot', () => {
        const { container } = render(
            <PrefectureCheckboxGroup
                prefectures={mockPrefectures}
                onPrefectureChange={mockOnPrefectureChange}
                disabled={false}
            />
        );
        expect(container).toMatchSnapshot();
    });
});