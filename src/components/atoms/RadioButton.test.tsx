import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton } from '@/components/atoms/RadioButton';

describe('Radiobutton', () => {
    const defaultProps = {
        value: 'test-value',
        checked: false,
        onChange: jest.fn(),
        disabled: false,
        label: 'Test Label'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with label', () => {
        render(<RadioButton {...defaultProps} />);

        const radioInput = screen.getByRole('radio', { name: 'Test Label' });

        expect(radioInput).toBeInTheDocument();
        expect(radioInput).toHaveAttribute('type', 'radio');
        expect(radioInput).toHaveAttribute('value', 'test-value');
    });

    it('handles checked state correctly', () => {
        render(<RadioButton {...defaultProps} checked={true} />);

        const radioInput = screen.getByRole('radio');
        expect(radioInput).toBeChecked();
    });

    it('handles unchecked state correctly', () => {
        render(<RadioButton {...defaultProps} checked={false} />);

        const radioInput = screen.getByRole('radio');
        expect(radioInput).not.toBeChecked();
    });

    it('calls onChange handler when clicked', () => {
        const handleChange = jest.fn();
        render(
            <RadioButton {...defaultProps} onChange={handleChange} />
        );

        const radioInput = screen.getByRole('radio');
        fireEvent.click(radioInput);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled props is true', () => {
        render(<RadioButton {...defaultProps} disabled={true} />);

        const radioInput = screen.getByRole('radio');
        expect(radioInput).toBeDisabled();
    });

    it('is enabled when disabled props is false', () => {
        render(<RadioButton {...defaultProps} disabled={false} />);

        const radioInput = screen.getByRole('radio');
        expect(radioInput).not.toBeDisabled();
    });

    it('does not trigger onChange when disabled', () => {
        const handleChange = jest.fn();
        render(
            <RadioButton {...defaultProps} onChange={handleChange} disabled={true} />
        );

        const radioInput = screen.getByRole('radio');
        fireEvent.click(radioInput);

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('applies margin-right class to label', () => {
        const { container } = render(<RadioButton {...defaultProps} />);
        const label = container.querySelector('label');
        expect(label).toHaveClass('mr-4');
    });

    it('should not be in the document when not rendered', () => {
        const { unmount } = render(<RadioButton {...defaultProps} />);
        unmount();

        const radioInput = screen.queryByRole('radio');
        expect(radioInput).not.toBeInTheDocument();
    });

    it('works correctly in a group of radio buttons', () => {
        const handleChange = jest.fn();

        render(
            <>
                <RadioButton
                    {...defaultProps}
                    value="option1"
                    label="Option 1"
                    onChange={handleChange}
                />
                <RadioButton
                    {...defaultProps}
                    value="option2"
                    label="Option 2"
                    onChange={handleChange}
                />
            </>
        );

        const option1 = screen.getByLabelText('Option 1');
        const option2 = screen.getByLabelText('Option 2');

        fireEvent.click(option1);
        expect(handleChange).toHaveBeenCalledTimes(1);

        fireEvent.click(option2);
        expect(handleChange).toHaveBeenCalledTimes(2);
    });
});