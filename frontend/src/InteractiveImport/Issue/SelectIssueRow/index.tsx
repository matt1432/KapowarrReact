// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import TableRowButton from 'Components/Table/TableRowButton';

// Types
import type { SelectStateInputProps } from 'typings/Inputs';
import type { Column } from 'Components/Table/Column';
import type { SelectIssueColumnName } from '../SelectIssueModalContent/columns';

export interface SelectIssueRowProps {
    id: number;
    issueNumber: number;
    title: string;
    columns: Column<SelectIssueColumnName>[];
    isSelected: boolean;
    onSelectedChange: (options: SelectStateInputProps) => void;
}

export default function SelectIssueRow({
    id,
    issueNumber,
    title,
    columns,
    isSelected,
    onSelectedChange,
}: SelectIssueRowProps) {
    const onPress = useCallback(() => {
        onSelectedChange({ id, value: !isSelected, shiftKey: false });
    }, [id, isSelected, onSelectedChange]);

    return (
        <TableRowButton onPress={onPress}>
            <TableSelectCell
                id={id}
                isSelected={isSelected}
                onSelectedChange={onSelectedChange}
            />

            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'issueNumber') {
                    return (
                        <TableRowCell key={name}>{issueNumber}</TableRowCell>
                    );
                }

                if (name === 'title') {
                    return <TableRowCell key={name}>{title}</TableRowCell>;
                }
            })}
        </TableRowButton>
    );
}
