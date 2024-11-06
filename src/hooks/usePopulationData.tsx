import { useState } from 'react';
import { fetchPopulation } from '../api/population';
import { usePrefectures } from './usePrefectures';
import { PopulationType, PopulationData } from '../components/types'

export const usePopulationData = () => {
    const { prefectures, error: prefecturesError } = usePrefectures();
    const [selectedPrefectures, setSelectedPrefectures] = useState<PopulationData[]>([]);
    const [populationType, setPopulationType] = useState<PopulationType>('総人口');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(prefecturesError);

    const handleCheckboxChange = async (prefCode: number, prefName: string, checked: boolean) => {
        try {
            setIsLoading(true);
            if (checked) {
                const response = await fetchPopulation(prefCode);

                const populationData = response.result.data.find((d) => d.label === populationType);
                if (!populationData) {
                    throw new Error(`${populationType}データが見つかりません`);
                }

                setSelectedPrefectures((prev) => [
                    ...prev,
                    {
                        prefName,
                        data: populationData.data.map((d) => ({
                            year: d.year,
                            value: d.value,
                        })),
                    },
                ]);
            } else {
                setSelectedPrefectures((prev) => prev.filter((p) => p.prefName !== prefName));
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePopulationTypeChange = async (newType: PopulationType) => {
        try {
            setIsLoading(true);
            setPopulationType(newType);

            const updatedData = await Promise.all(
                selectedPrefectures.map(async (pref) => {
                    const response = await fetchPopulation(
                        prefectures.find((p) => p.prefName === pref.prefName)?.prefCode || 0
                    );
                    const populationData = response.result.data.find((d) => d.label === newType);
                    if (!populationData) {
                        throw new Error(`${newType}のデータが見つかりません`);
                    }
                    return {
                        prefName: pref.prefName,
                        data: populationData.data.map((d) => ({
                            year: d.year,
                            value: d.value,
                        })),
                    };
                })
            );
            setSelectedPrefectures(updatedData);
        } catch (error) {
            setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        prefectures,
        selectedPrefectures,
        populationType,
        isLoading,
        error,
        handleCheckboxChange,
        handlePopulationTypeChange,
    };
};
