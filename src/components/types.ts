export interface Prefecture {
    prefCode: number;
    prefName: string;
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

export type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';