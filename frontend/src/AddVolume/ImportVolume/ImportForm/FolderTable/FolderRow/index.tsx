// IMPORTS

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

interface FolderRowProps {
    columns: Column<'value' | 'actions'>[];
    folder: string;
    onEditRow: (change: InputChanged<string, string>) => void;
    onAddPress?: () => void;
    onDeletePress?: () => void;
}

// IMPLEMENTATIONS

export default function FolderRow({
    columns,
    folder,
    onEditRow,
    onAddPress,
    onDeletePress,
}: FolderRowProps) {
    return (
        <TableRow className={styles.row}>
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
                                onChange={onEditRow}
                                onSubmit={onAddPress}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell className={styles.cell}>
                            {onAddPress ? (
                                <IconButton
                                    title={translate('Add')}
                                    name={icons.ADD}
                                    onPress={onAddPress}
                                />
                            ) : null}

                            {onDeletePress ? (
                                <IconButton
                                    title={translate('Delete')}
                                    name={icons.REMOVE}
                                    onPress={onDeletePress}
                                />
                            ) : null}
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
