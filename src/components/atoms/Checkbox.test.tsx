import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from '@/components/atoms/Checkbox';

describe('Checkbox', () => {
    const defaultProps = {
        onChange: jest.fn(),
        disabled: false,
        label: 'Test Checkbox',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render checkbox with label', () => {
        render(<Checkbox {...defaultProps} />);

        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        const label = screen.getByText('Test Checkbox');

        expect(checkbox).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(checkbox.disabled).toBe(false);
    });

    it('should call onChange when clicked', () => {
        render(<Checkbox {...defaultProps} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(true);

        fireEvent.click(checkbox);
        expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Checkbox {...defaultProps} disabled={true} />);

        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);

        fireEvent.click(checkbox);
        expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('should update label when label prop changes', () => {
        const { rerender } = render(<Checkbox {...defaultProps} />);
        expect(screen.getByText('Test Checkbox')).toBeInTheDocument();

        rerender(<Checkbox {...defaultProps} label="Updated Label" />);
        expect(screen.getByText('Updated Label')).toBeInTheDocument();
    });
});