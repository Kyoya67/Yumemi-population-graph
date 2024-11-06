interface RadioButtonProps {
    value: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: string;
}

export const RadioButton = ({ value, checked, onChange, disabled, label }: RadioButtonProps) => (
    <label className="mr-4">
        <input
            type="radio"
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        />
        {label}
    </label>
);