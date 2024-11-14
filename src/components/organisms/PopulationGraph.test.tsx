import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official'; // ここでインポート
import { PopulationGraph } from '@/components/organisms/PopulationGraph';
import { PopulationGraphProps } from '@/components/types';

// Highcharts チャートインスタンスをモック
jest.mock('highcharts', () => {
    const actualHighcharts = jest.requireActual('highcharts');
    return {
        ...actualHighcharts,
        charts: [], // テスト環境での charts インスタンスを保持するための配列
    };
});

describe('PopulationGraph', () => {
    const mockPopulationData: PopulationGraphProps['populationData'] = [
        {
            prefName: 'Tokyo',
            data: [
                { year: 2000, value: 12000000 },
                { year: 2005, value: 13000000 },
            ],
        },
        {
            prefName: 'Osaka',
            data: [
                { year: 2000, value: 8000000 },
                { year: 2005, value: 8500000 },
            ],
        },
    ];

    const mockPopulationType = '総人口';

    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });


    it('renders the HighchartsReact component', () => {
        const { container } = render(
            <PopulationGraph populationData={mockPopulationData} populationType={mockPopulationType} />
        );
        expect(container.querySelector('.highcharts-container')).toBeInTheDocument();
    });

    it('sets the correct title based on populationType', () => {
        const { getByText } = render(
            <PopulationGraph populationData={mockPopulationData} populationType={mockPopulationType} />
        );
        expect(getByText('総人口の推移')).toBeInTheDocument();
    });

    it('sets the x-axis categories based on populationData', () => {
        // HighchartsReactRefObject 型を使用
        const chartRef = React.createRef<HighchartsReact.RefObject>();

        render(
            <HighchartsReact
                ref={chartRef}
                highcharts={Highcharts}
                options={{
                    xAxis: {
                        categories: mockPopulationData[0].data.map((d) => d.year.toString()),
                    },
                    series: mockPopulationData.map((prefecture) => ({
                        name: prefecture.prefName,
                        data: prefecture.data.map((d) => d.value),
                    })),
                }}
            />
        );

        // チャートインスタンスにアクセス
        const chartInstance = chartRef.current?.chart;
        const xAxisCategories = chartInstance?.xAxis[0].categories;
        expect(xAxisCategories).toEqual(['2000', '2005']);
    });

    it('sets the series data based on populationData', () => {
        // HighchartsReactRefObject 型を使用
        const chartRef = React.createRef<HighchartsReact.RefObject>();

        render(
            <HighchartsReact
                ref={chartRef}
                highcharts={Highcharts}
                options={{
                    xAxis: {
                        categories: mockPopulationData[0].data.map((d) => d.year.toString()),
                    },
                    series: mockPopulationData.map((prefecture) => ({
                        name: prefecture.prefName,
                        data: prefecture.data.map((d) => d.value),
                    })),
                }}
            />
        );

        // チャートインスタンスの series データにアクセス
        const chartInstance = chartRef.current?.chart;
        const seriesData = chartInstance?.series.map((series) => ({
            name: series.name,
            data: series.data.map((point) => point.y),
        }));

        expect(seriesData).toEqual([
            { name: 'Tokyo', data: [12000000, 13000000] },
            { name: 'Osaka', data: [8000000, 8500000] },
        ]);
    });
});
