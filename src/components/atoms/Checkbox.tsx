interface CheckboxProps {
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
}

export const Checkbox = ({ onChange, disabled, label }: CheckboxProps) => (
    <label className="flex items-center p-1">
        <input
            type="checkbox"
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
        />
        <span className="ml-1">{label}</span>
    </label>
);