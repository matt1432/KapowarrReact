// IMPORTS

// React
import { useMemo } from 'react';

// Redux
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';

// Specific Components
import RootFolderSelectInputOption from '../RootFolderSelectInputOption';
import RootFolderSelectInputSelectedValue from '../RootFolderSelectInputSelectedValue';

import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from '../EnhancedSelectInput';

// Types
export type RootFolderSelectInputProps = Omit<
    EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>,
    'values'
>;

// IMPLEMENTATIONS

function RootFolderSelectInput({
    name,
    onChange,
    value,
    ...otherProps
}: RootFolderSelectInputProps) {
    const { data } = useGetRootFoldersQuery(undefined);

    const values = useMemo(() => {
        const values =
            data?.map(
                (f) =>
                    ({
                        key: f.folder,
                        value: f.folder,
                    }) satisfies EnhancedSelectInputValue<string> as EnhancedSelectInputValue<string>,
            ) ?? [];

        return values;
    }, [data]);

    return (
        <>
            <EnhancedSelectInput
                {...otherProps}
                name={name}
                value={value}
                values={values}
                selectedValueComponent={RootFolderSelectInputSelectedValue}
                optionComponent={RootFolderSelectInputOption}
                onChange={onChange}
            />
        </>
    );
}

export default RootFolderSelectInput;
