// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// General Components
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import FolderRow from './FolderRow';
import InputRow from './InputRow';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

export type FolderTableColumnName = 'value' | 'actions';

interface FolderTableProps<T extends string> {
    name: T;
    values: string[];
    onChange: (change: InputChanged<T, string[]>) => void;
}

// IMPLEMENTATIONS

export default function FolderTable<T extends string>({
    name,
    values,
    onChange,
}: FolderTableProps<T>) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.folderTable,
    );

    const onAddPress = useCallback(
        (folder: string) => {
            onChange({ name, value: [...values, folder] });
        },
        [name, onChange, values],
    );

    const onDeletePress = useCallback(
        (folder: string) => () => {
            onChange({ name, value: values.filter((f) => f !== folder) });
        },
        [name, onChange, values],
    );

    const onEditRow = useCallback(
        (index: number) =>
            ({ value }: InputChanged<string, string>) => {
                const newValues = [...values];
                newValues[index] = value;
                onChange({ name, value: newValues });
            },
        [name, onChange, values],
    );

    return (
        <Table
            tableName="folderTable"
            columns={columns}
            containerClassName={styles.container}
        >
            <TableBody>
                {values.map((folder, i) => {
                    return (
                        <FolderRow
                            key={i}
                            folder={folder}
                            columns={columns}
                            onEditRow={onEditRow(i)}
                            onDeletePress={onDeletePress(folder)}
                        />
                    );
                })}

                <InputRow columns={columns} onAddPress={onAddPress} />
            </TableBody>
        </Table>
    );
}
