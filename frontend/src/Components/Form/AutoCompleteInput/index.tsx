// IMPORTS

// React
import { type SyntheticEvent, useCallback, useState } from 'react';

// Misc
import jdu from 'jdu';

// Specific Components
import AutoSuggestInput from '../AutoSuggestInput';

// Types
import type { ChangeEvent, SuggestionsFetchRequestedParams } from 'react-autosuggest';
import type { InputChanged } from 'typings/Inputs';

export interface AutoCompleteInputProps<K extends string> {
    name: K;
    readOnly?: boolean;
    value?: string;
    values: string[];
    onChange: (change: InputChanged<K, string>) => unknown;
}

// IMPLEMENTATIONS

export default function AutoCompleteInput<K extends string>({
    name,
    value = '',
    values,
    onChange,
    ...otherProps
}: AutoCompleteInputProps<K>) {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const getSuggestionValue = useCallback((item: string) => {
        return item;
    }, []);

    const renderSuggestion = useCallback((item: string) => {
        return item;
    }, []);

    const handleInputChange = useCallback(
        (_event: SyntheticEvent, { newValue }: ChangeEvent) => {
            onChange({
                name,
                value: newValue,
            });
        },
        [name, onChange],
    );

    const handleInputBlur = useCallback(() => {
        setSuggestions([]);
    }, [setSuggestions]);

    const handleSuggestionsFetchRequested = useCallback(
        ({ value: newValue }: SuggestionsFetchRequestedParams) => {
            const lowerCaseValue = jdu.replace(newValue).toLowerCase();

            const filteredValues = values.filter((v) => {
                return jdu.replace(v).toLowerCase().includes(lowerCaseValue);
            });

            setSuggestions(filteredValues);
        },
        [values, setSuggestions],
    );

    const handleSuggestionsClearRequested = useCallback(() => {
        setSuggestions([]);
    }, [setSuggestions]);

    return (
        <AutoSuggestInput
            {...otherProps}
            name={name}
            value={value}
            suggestions={suggestions}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={handleSuggestionsClearRequested}
        />
    );
}
