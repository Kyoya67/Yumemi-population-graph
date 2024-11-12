import React from 'react';
import { CheckboxProps } from '@/components/types';

export const Checkbox = ({ onChange, disabled, label }: CheckboxProps) => (
    <label className={`flex items-center p-1 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        <input
            type="checkbox"
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
            className="cursor-inherit"
        />
        <span className="ml-1">{label}</span>
    </label>
);