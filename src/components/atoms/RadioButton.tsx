import React from 'react';
import { RadioButtonProps } from '@/components/types';

export const RadioButton = ({ value, checked, onChange, disabled, label }: RadioButtonProps) => (
    <label className="mr-4">
        <input
            type="radio"
            name="populationType"
            value={value}
            checked={checked}
            onChange={() => !disabled && onChange()}
            disabled={disabled}
        />
        {label}
    </label>
);