// IMPORTS

// React
import { useCallback } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';

// Specific Components
import EnhancedSelectInput from './EnhancedSelectInput';

// Types
import type { EnhancedSelectInputChanged } from 'typings/inputs';

export interface IndexerFlagsSelectInputProps {
    name: string;
    indexerFlags: number;
    onChange(payload: EnhancedSelectInputChanged<number>): void;
}

// IMPLEMENTATIONS

/*
const selectIndexerFlagsValues = (selectedFlags: number) =>
    createSelector(
        (state: AppState) => state.settings.indexerFlags,
        (indexerFlags) => {
            const value = indexerFlags.items.reduce((acc: number[], { id }) => {
                if ((selectedFlags & id) === id) {
                    acc.push(id);
                }

                return acc;
            }, []);

            const values = indexerFlags.items.map(({ id, name }) => ({
                key: id,
                value: name,
            }));

            return {
                value,
                values,
            };
        },
    );
*/

function IndexerFlagsSelectInput({
    name,
    // indexerFlags,
    onChange,
    ...otherProps
}: IndexerFlagsSelectInputProps) {
    // const { value, values } = useSelector(selectIndexerFlagsValues(indexerFlags));
    const value = [0];
    const values = [{ value: '', key: 0 }];

    const handleChange = useCallback(
        (change: EnhancedSelectInputChanged<number[]>) => {
            const indexerFlags = change.value.reduce((acc, flagId) => acc + flagId, 0);

            onChange({ name, value: indexerFlags });
        },
        [name, onChange],
    );

    return (
        <EnhancedSelectInput
            {...otherProps}
            name={name}
            value={value}
            values={values}
            onChange={handleChange}
        />
    );
}

export default IndexerFlagsSelectInput;
