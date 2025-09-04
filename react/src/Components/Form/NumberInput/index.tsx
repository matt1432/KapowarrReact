// IMPORTS

// React
import { useCallback, useEffect, useRef, useState } from 'react';

// Misc
import usePrevious from 'Helpers/Hooks/usePrevious';

// Specific Components
import TextInput, { type TextInputProps } from '../TextInput';

// Types
import type { InputChanged } from 'typings/Inputs';

export interface NumberInputProps<K extends string>
    extends Omit<TextInputProps<K, 'number'>, 'value' | 'onChange'> {
    value?: number | null;
    min?: number;
    max?: number;
    isFloat?: boolean;
    onChange: (input: InputChanged<K, number | null>) => void;
}

// IMPLEMENTATIONS

function parseValue(
    value: string | null | undefined,
    isFloat: boolean,
    min: number | undefined,
    max: number | undefined,
) {
    if (!value || value === '') {
        return null;
    }

    let newValue = isFloat ? parseFloat(value) : parseInt(value);

    if (min && newValue !== null && newValue < min) {
        newValue = min;
    }
    else if (max && newValue !== null && newValue > max) {
        newValue = max;
    }

    return newValue;
}

export default function NumberInput<K extends string>({
    name,
    value: inputValue = null,
    isFloat = false,
    min,
    max,
    onChange,
    ...otherProps
}: NumberInputProps<K>) {
    const [value, setValue] = useState(inputValue === null ? '' : inputValue.toString());
    const isFocused = useRef(false);
    const previousValue = usePrevious(inputValue);

    const handleChange = useCallback(
        ({ name, value: newValue }: InputChanged<K, string>) => {
            setValue(newValue);

            onChange({
                name,
                value: parseValue(newValue, isFloat, min, max),
            });
        },
        [isFloat, min, max, onChange, setValue],
    );

    const handleFocus = useCallback(() => {
        isFocused.current = true;
    }, []);

    const handleBlur = useCallback(() => {
        const parsedValue = parseValue(value, isFloat, min, max);
        const stringValue = parsedValue === null ? '' : parsedValue.toString();

        if (stringValue !== value) {
            setValue(stringValue);
        }

        onChange({
            name,
            value: parsedValue,
        });

        isFocused.current = false;
    }, [name, value, isFloat, min, max, onChange]);

    useEffect(() => {
        if (inputValue === null) {
            setValue('');
        }
        else if (!isNaN(inputValue) && inputValue !== previousValue && !isFocused.current) {
            setValue(inputValue === null ? '' : inputValue.toString());
        }
    }, [inputValue, previousValue, setValue]);

    return (
        <TextInput
            {...otherProps}
            name={name}
            type="number"
            value={value === null ? '' : value}
            min={min}
            max={max}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    );
}
