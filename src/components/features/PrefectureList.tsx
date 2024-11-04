"use client";

import React, { useEffect, useState } from 'react';
import { fetchPrefectures } from '../../api/prefectures';
import { fetchPopulation } from '../../api/population';
import { PopultionGraph } from '../ui/PopulationGraph';

interface Prefecture {
    prefCode: number;
    prefName: string;
}

interface PopulationData {
    prefName: string;
    data: {
        year: number;
        value: number;
    }[];
}

export const PrefectureList = () => {
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [selectedPrefectures, setSelectedPrefectures] = useState<PopulationData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPrefectures = async () => {
            try {
                const data = await fetchPrefectures();
                setPrefectures(data.result);
            } catch (error) {
                console.error('Error fetching prefectures:', error);
                setError('Failed to fetch prefectures');
            }
        }

        loadPrefectures();
    }, []);

    const handleCheckboxChange = async (prefecture: Prefecture, checked: boolean) => {
        try {
            if (checked) {
                const response = await fetchPopulation(prefecture.prefCode);
                console.log(response);

                const totalPopulation = response.result.data.find(d => d.label === '総人口');
                if (!totalPopulation) {
                    throw new Error('総人口データが見つかりません');
                }

                setSelectedPrefectures(prev => [...prev, {
                    prefName: prefecture.prefName,
                    data: totalPopulation.data.map(d => ({
                        year: d.year,
                        value: d.value
                    }))
                }]);
            } else {
                setSelectedPrefectures(prev =>
                    prev.filter(p => p.prefName !== prefecture.prefName)
                );
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {prefectures.map((pref) => (
                    <label
                        key={pref.prefCode}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px'
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={e => handleCheckboxChange(pref, e.target.checked)}
                            disabled={isLoading}
                        />
                        <span style={{ marginLeft: '5px' }}>{pref.prefName}</span>
                    </label>
                ))}
            </div>

            {selectedPrefectures.length > 0 && <PopultionGraph populationData={selectedPrefectures} />}
        </div>
    );
};