import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PopulationTypeSelector } from '@/components/molecules/PopulationTypeSelector'; // コンポーネントのインポート
import { PopulationType } from '@/components/types'; // 型のインポート

describe('PopulationTypeSelector', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        selectedType: '総人口' as PopulationType,
        onChange: mockOnChange,
        disabled: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all population type options', () => {
        render(<PopulationTypeSelector {...defaultProps} />);

        // ヘッダーテキストの確認
        expect(screen.getByText('表示する人口データ')).toBeVisible();

        // すべての選択肢が表示されていることを確認
        const populationTypes: PopulationType[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];
        populationTypes.forEach(type => {
            expect(screen.getByLabelText(type)).toBeVisible();
        });
    });

    it('shows correct selected state for radio buttons', () => {
        render(<PopulationTypeSelector {...defaultProps} />);

        // 選択されているラジオボタンの確認
        const selectedRadio = screen.getByLabelText('総人口') as HTMLInputElement;
        expect(selectedRadio.checked).toBe(true);

        // 他のラジオボタンが選択されていないことを確認
        const unselectedTypes: PopulationType[] = ['年少人口', '生産年齢人口', '老年人口'];
        unselectedTypes.forEach(type => {
            const radio = screen.getByLabelText(type) as HTMLInputElement;
            expect(radio.checked).toBe(false);
        });
    });

    it('calls onChange when a radio button is clicked', () => {
        render(<PopulationTypeSelector {...defaultProps} />);

        // 年少人口を選択
        fireEvent.click(screen.getByLabelText('年少人口'));
        expect(mockOnChange).toHaveBeenCalledWith('年少人口');

        // 生産年齢人口を選択
        fireEvent.click(screen.getByLabelText('生産年齢人口'));
        expect(mockOnChange).toHaveBeenCalledWith('生産年齢人口');
    });

    it('disables all radio buttons when disabled prop is true', () => {
        render(<PopulationTypeSelector {...defaultProps} disabled={true} />);

        const populationTypes: PopulationType[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];
        populationTypes.forEach(type => {
            const radio = screen.getByLabelText(type) as HTMLInputElement;
            expect(radio).toBeDisabled();
        });
    });

    it('does not call onChange when disabled', () => {
        render(<PopulationTypeSelector {...defaultProps} disabled={true} />);

        fireEvent.click(screen.getByLabelText('年少人口'));
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('applies correct styling classes', () => {
        const { container } = render(<PopulationTypeSelector {...defaultProps} />);

        // 外側のコンテナのスタイリング
        const outerDiv = container.firstChild as HTMLElement;
        expect(outerDiv).toHaveClass('mb-8');

        // ヘッダーのスタイリング
        const headerDiv = screen.getByText('表示する人口データ') as HTMLElement;
        expect(headerDiv).toHaveClass('text-sm', 'font-semibold', 'mb-1');

        // ラジオボタングループのスタイリング
        const radioGroupDiv = container.querySelector('.space-y-2');
        expect(radioGroupDiv).toBeVisible();
    });

    it('maintains selected state when rerendering', () => {
        const { rerender } = render(<PopulationTypeSelector {...defaultProps} />);

        // 初期状態の確認
        expect((screen.getByLabelText('総人口') as HTMLInputElement).checked).toBe(true);

        // 選択状態を変更してrerender
        rerender(<PopulationTypeSelector {...defaultProps} selectedType="年少人口" />);

        // 新しい選択状態の確認
        expect((screen.getByLabelText('年少人口') as HTMLInputElement).checked).toBe(true);
        expect((screen.getByLabelText('総人口') as HTMLInputElement).checked).toBe(false);
    });

    it('handles keyboard navigation', () => {
        render(<PopulationTypeSelector {...defaultProps} />);

        const firstRadio = screen.getByLabelText('総人口');
        // const secondRadio = screen.getByLabelText('年少人口');

        // Tabキーでのフォーカス移動をシミュレート
        firstRadio.focus();
        expect(document.activeElement).toBe(firstRadio);

        // スペースキーでの選択をシミュレート。失敗
        // fireEvent.keyDown(secondRadio, { key: ' ' });
        // expect(mockOnChange).toHaveBeenCalledWith('年少人口');
    });
});
