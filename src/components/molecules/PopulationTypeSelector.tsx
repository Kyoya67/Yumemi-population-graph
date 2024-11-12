import React from 'react';
import { RadioButton } from '@/components/atoms/RadioButton';
import { PopulationType } from '@/components/types';
import { PopulationTypeSelectorProps } from '@/components/types';

export const PopulationTypeSelector = ({
    selectedType,
    onChange,
    disabled
}: PopulationTypeSelectorProps) => {
    const populationTypes: PopulationType[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

    return (
        <div className="mb-8">
            <div className="text-sm font-semibold mb-1">表示する人口データ</div>
            <div className="space-y-2">
                {populationTypes.map((type) => (
                    <RadioButton
                        key={type}
                        value={type}
                        checked={selectedType === type}
                        onChange={() => onChange(type)}
                        disabled={disabled}
                        label={type}
                    />
                ))}
            </div>
        </div>
    );
};
