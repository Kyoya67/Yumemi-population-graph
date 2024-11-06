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

export type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';
