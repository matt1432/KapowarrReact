// IMPORTS

// React
import { useMemo } from 'react';

// Redux
import { useGetRootFoldersQuery } from 'Store/createApiEndpoints';

// Specific Components
import RootFolderSelectInputOption from './RootFolderSelectInputOption';
import RootFolderSelectInputSelectedValue from './RootFolderSelectInputSelectedValue';

import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';

// Types
export type RootFolderSelectInputProps = Omit<
    EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>,
    'value' | 'values'
>;

// IMPLEMENTATIONS

function RootFolderSelectInput({ name, onChange, ...otherProps }: RootFolderSelectInputProps) {
    const { data } = useGetRootFoldersQuery(undefined);

    const values = useMemo(() => {
        const values =
            data?.map(
                (f) =>
                    ({
                        key: f.path,
                        value: f.path,
                    }) satisfies EnhancedSelectInputValue<string> as EnhancedSelectInputValue<string>,
            ) ?? [];

        return values;
    }, [data]);

    return (
        <>
            <EnhancedSelectInput
                {...otherProps}
                name={name}
                value={data?.at(0)?.path ?? ''}
                values={values}
                selectedValueComponent={RootFolderSelectInputSelectedValue}
                optionComponent={RootFolderSelectInputOption}
                onChange={onChange}
            />
        </>
    );
}

export default RootFolderSelectInput;
