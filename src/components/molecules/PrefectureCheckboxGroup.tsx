import { Checkbox } from '../atoms/Checkbox';
import { Prefecture } from '../types';

interface PrefectureCheckboxGroupProps {
    prefectures: Prefecture[];
    onPrefectureChange: (prefecture_code: number, prefecture_name: string, checked: boolean) => void;
    disabled?: boolean;
}

export const PrefectureCheckboxGroup = ({
    prefectures,
    onPrefectureChange,
    disabled
}: PrefectureCheckboxGroupProps) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {prefectures.map((pref) => (
            <Checkbox
                key={pref.prefCode}
                onChange={(checked) => onPrefectureChange(pref.prefCode, pref.prefName, checked)}
                disabled={disabled}
                label={pref.prefName}
            />
        ))}
    </div>
);