export interface Prefecture {
    prefCode: number;
    prefName: string;
}

export interface CheckboxProps {
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
}

export interface RadioButtonProps {
    value: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: string;
}

export interface PopulationGraphProps {
    populationData: PopulationData[];
    populationType: PopulationType;
}

export interface PopulationData {
    prefName: string;
    data: {
        year: number;
        value: number;
    }[];
}

export interface PopulationDataItem {
    year: number;
    value: number;
    rate?: number;
}

export interface PrefectureCheckboxGroupProps {
    prefectures: Prefecture[];
    onPrefectureChange: (prefectureCode: number, prefectureName: string, checked: boolean) => void;
    disabled?: boolean;
}

export interface PopulationTypeSelectorProps {
    selectedType: PopulationType;
    onChange: (type: PopulationType) => void;
    disabled?: boolean;
}

export interface PopulationCompositionData {
    label: string;
    data: PopulationDataItem[];
}

export interface PopulationResult {
    label: string;
    data: PopulationCompositionData[];
}

export interface PopulationResponse {
    message: null;
    result: PopulationResult;
}

export interface PopulationAnalysisTemplateProps {
    children: React.ReactNode;
}

export type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';