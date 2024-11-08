import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PopulationTypeSelector } from '@/components/molecules/PopulationTypeSelector';

describe('PopulationTypeSelector', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        render(
            <PopulationTypeSelector
                selectedType="総人口"
                onChange={mockOnChange}
                disabled={false}
            />
        );
    });

    test('renders correctly with initial props', () => {
        expect(screen.getByText('表示する人口データ')).toBeInTheDocument();
        expect(screen.getByLabelText('総人口')).toBeChecked();
        expect(screen.getByLabelText('年少人口')).toBeInTheDocument();
        expect(screen.getByLabelText('生産年齢人口')).toBeInTheDocument();
        expect(screen.getByLabelText('老年人口')).toBeInTheDocument();
    });

    test('calls onChange when a radio button is selected', () => {
        fireEvent.click(screen.getByLabelText('年少人口'));
        expect(mockOnChange).toHaveBeenCalledWith('年少人口');
    });

    test('disables radio buttons when disabled prop is true', () => {
        render(
            <PopulationTypeSelector
                selectedType="総人口"
                onChange={mockOnChange}
                disabled={true}
            />
        );
        expect(screen.getByLabelText('総人口')).toBeDisabled();
        expect(screen.getByLabelText('年少人口')).toBeDisabled();
        expect(screen.getByLabelText('生産年齢人口')).toBeDisabled();
        expect(screen.getByLabelText('老年人口')).toBeDisabled();
    });
});