import { Checkbox } from '@/components/atoms/Checkbox';
import { Prefecture } from '@/components/types';

interface PrefectureCheckboxGroupProps {
    prefectures: Prefecture[];
    onPrefectureChange: (prefectureCode: number, prefectureName: string, checked: boolean) => void;
    disabled?: boolean;
}

export const PrefectureCheckboxGroup = ({
    prefectures,
    onPrefectureChange,
    disabled
}: PrefectureCheckboxGroupProps) => (
    <div className="flex flex-wrap gap-2 mb-5">
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
