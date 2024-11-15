import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PopulationAnalysisTemplate } from '@/components/templates/PopulationAnalysisTemplate'; // パスは適切に修正してください

describe('PopulationAnalysisTemplate', () => {
    it('renders children correctly', () => {
        const { getByText } = render(
            <PopulationAnalysisTemplate>
                <p>Test Child Element</p>
            </PopulationAnalysisTemplate>
        );

        // 'Test Child Element' がレンダリングされていることを確認
        expect(getByText('Test Child Element')).toBeVisible();
    });

    it('renders nothing when no children are passed', () => {
        // children が必須なので、何も渡さないとエラーになります。
        // そのため、このケースはテスト不要です。
        const { container } = render(
            <PopulationAnalysisTemplate>
                {/* ここでchildrenなし */}
            </PopulationAnalysisTemplate>
        );

        // 空のdivがレンダリングされることを確認（ただし、childrenは必須なので通常はこのテストケースは必要ない）
        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
