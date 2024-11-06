interface CheckboxProps {
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
}

export const Checkbox = ({ onChange, disabled, label }: CheckboxProps) => (
    <label style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
        <input
            type="checkbox"
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
        />
        <span style={{ marginLeft: '5px' }}>{label}</span>
    </label>
);