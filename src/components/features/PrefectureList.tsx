"use client";

import React, { useEffect, useState } from 'react';
import { fetchPrefectures } from '../../api/prefectures';
import { fetchPopulation } from '../../api/population';
import { PopultionGraph } from '../ui/PopulationGraph';

type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口'

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
    const [populationType, setPopulationType] = useState<PopulationType>('総人口');

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
            setIsLoading(true);
            if (checked) {
                const response = await fetchPopulation(prefecture.prefCode);

                const populationData = response.result.data.find(d => d.label === populationType);
                if (!populationData) {
                    throw new Error(`${populationType}データが見つかりません`);
                }

                setSelectedPrefectures(prev => [...prev, {
                    prefName: prefecture.prefName,
                    data: populationData.data.map(d => ({
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

    const handlePopulationTypeChange = async (newType: PopulationType) => {
        try {
            setIsLoading(true);
            setPopulationType(newType);

            const updatedData = await Promise.all(
                selectedPrefectures.map(async (pref) => {
                    const response = await fetchPopulation(
                        prefectures.find(p => p.prefName === pref.prefName)?.prefCode || 0
                    );
                    const populationData = response.result.data.find(d => d.label === newType);
                    if (!populationData) {
                        throw new Error(`${newType}のデータが見つかりません`);
                    }
                    return {
                        prefName: pref.prefName,
                        data: populationData.data.map(d => ({
                            year: d.year,
                            value: d.value
                        }))
                    };
                })
            );
            setSelectedPrefectures(updatedData);
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <label>表示する人口</label>
                <select value={populationType} onChange={e => handlePopulationTypeChange(e.target.value as PopulationType)} style={{ marginLeft: '10px' }}>
                    <option value="総人口">総人口</option>
                    <option value="年少人口">年少人口</option>
                    <option value="生産年齢人口">生産年齢人口</option>
                    <option value="老年人口">老年人口</option>
                </select>
            </div>
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

            {selectedPrefectures.length > 0 && (
                <PopultionGraph
                    populationData={selectedPrefectures}
                    populationType={populationType}
                />
            )}
        </div>
    );
};