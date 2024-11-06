"use client"
import { useEffect, useState } from 'react';
import { fetchPrefectures } from '../api/prefectures';
import { Prefecture } from '../components/types';

export const usePrefectures = () => {
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPrefectures = async () => {
            try {
                const data = await fetchPrefectures();
                setPrefectures(data.result);
            } catch (error) {
                console.error('Error fetching prefectures:', error);
                setError('Failed to fetch prefectures');
            }
        };

        loadPrefectures();
    }, []);

    return { prefectures, error };
};
