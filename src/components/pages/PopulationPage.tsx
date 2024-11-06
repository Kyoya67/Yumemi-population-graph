"use client"

import { PopulationTypeSelector } from '../molecules/PopulationTypeSelector';
import { PrefectureCheckboxGroup } from '../molecules/PrefectureCheckboxGroup';
import { PopulationGraph } from '../organisms/PopulationGraph';
import { PopulationAnalysisTemplate } from '../template/PopulationAnalysisTemplate';
import { usePopulationData } from '../../hooks/usePopulationData';

export const PopulationPage = () => {
    const {
        prefectures,
        selectedPrefectures,
        populationType,
        isLoading,
        error,
        handleCheckboxChange,
        handlePopulationTypeChange,
    } = usePopulationData();

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <PopulationAnalysisTemplate>
            <PopulationTypeSelector
                selectedType={populationType}
                onChange={handlePopulationTypeChange}
                disabled={isLoading}
            />
            <PrefectureCheckboxGroup
                prefectures={prefectures}
                onPrefectureChange={handleCheckboxChange}
                disabled={isLoading}
            />
            {selectedPrefectures.length > 0 && (
                <PopulationGraph
                    populationData={selectedPrefectures}
                    populationType={populationType}
                />
            )}
        </PopulationAnalysisTemplate>
    );
};
