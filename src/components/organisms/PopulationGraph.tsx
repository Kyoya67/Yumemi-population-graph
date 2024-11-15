import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { PopulationGraphProps } from '@/components/types';

export const PopulationGraph = ({ populationData, populationType }: PopulationGraphProps) => {
    const options: Highcharts.Options = {
        accessibility: {
            enabled: false,  // アクセシビリティ警告を無効化
        },
        title: {
            text: `${populationType}の推移`,
        },
        xAxis: {
            title: {
                text: '年度',
            },
            categories: populationData[0]?.data.map((d) => d.year.toString()) || [],
        },
        yAxis: {
            title: {
                text: '総人口',
            },
        },
        series: populationData.map((prefecture) => ({
            type: 'line',
            name: prefecture.prefName,
            data: prefecture.data.map((d) => d.value),
        })),
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
            },
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                    },
                },
            ],
        },
    };

    return (
        <div data-testid="population-graph">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

