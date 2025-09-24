// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import TextInput from 'Components/Form/TextInput';

// CSS
import styles from '../index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { InputChanged } from 'typings/Inputs';

interface InputRowProps {
    columns: Column<'value' | 'actions'>[];
    onAddPress: (folder: string) => void;
}

// IMPLEMENTATIONS

export default function InputRow({ columns, onAddPress }: InputRowProps) {
    const [folder, setFolder] = useState<string>('');

    const handleInputChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setFolder(value);
        },
        [],
    );

    const handleAddPress = useCallback(() => {
        onAddPress(folder);
        setFolder('');
    }, [onAddPress, folder]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'value') {
                    return (
                        <TableRowCell className={styles.cell}>
                            <TextInput
                                name="folder"
                                value={folder}
                                onChange={handleInputChange}
                                onSubmit={handleAddPress}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell className={styles.cell}>
                            <IconButton
                                title={translate('Add')}
                                name={icons.ADD}
                                onPress={handleAddPress}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
