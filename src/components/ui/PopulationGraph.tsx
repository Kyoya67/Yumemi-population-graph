"use client";

import React from 'react';
import Hightcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PopulationData {
    prefName: string;
    data: {
        year: number;
        value: number;
    }[];
}

type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

interface PopulationGraphProps {
    populationData: PopulationData[];
    populationType: PopulationType;
}

export const PopultionGraph = ({ populationData, populationType }: PopulationGraphProps) => {
    const options: Highcharts.Options = {
        title: {
            text: `${populationType}の推移`
        },
        xAxis: {
            title: {
                text: '年度'
            },
            categories: populationData[0]?.data.map(d => d.year.toString()) || []
        },
        yAxis: {
            title: {
                text: '総人口'
            }
        },
        series: populationData.map(prefecture => ({
            type: 'line',
            name: prefecture.prefName,
            data: prefecture.data.map(d => d.value)
        })),
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Hightcharts}
                options={options}
            />
        </div>
    )
}