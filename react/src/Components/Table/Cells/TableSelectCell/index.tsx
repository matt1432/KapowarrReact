// IMPORTS

// React
import { useCallback, useEffect, useRef } from 'react';

// General Components
import CheckInput from 'Components/Form/CheckInput';

// Specific Components
import TableRowCell, { type TableRowCellProps } from '../TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';
import type { SelectStateInputProps } from 'typings/Inputs';

interface TableSelectCellProps extends Omit<TableRowCellProps, 'id'> {
    className?: string;
    id: number | string;
    isSelected?: boolean;
    onSelectedChange: (options: SelectStateInputProps) => void;
}

// IMPLEMENTATIONS

function TableSelectCell({
    className = styles.selectCell,
    id,
    isSelected = false,
    onSelectedChange,
    ...otherProps
}: TableSelectCellProps) {
    const initialIsSelected = useRef(isSelected);
    const handleSelectedChange = useRef(onSelectedChange);

    handleSelectedChange.current = onSelectedChange;

    const handleChange = useCallback(
        ({ value, shiftKey }: CheckInputChanged) => {
            onSelectedChange({ id, value, shiftKey });
        },
        [id, onSelectedChange],
    );

    useEffect(() => {
        handleSelectedChange.current({
            id,
            value: initialIsSelected.current,
            shiftKey: false,
        });

        return () => {
            handleSelectedChange.current({ id, value: null, shiftKey: false });
        };
    }, [id]);

    return (
        <TableRowCell className={className}>
            <CheckInput
                className={styles.input}
                name={id.toString()}
                value={isSelected}
                {...otherProps}
                onChange={handleChange}
            />
        </TableRowCell>
    );
}

export default TableSelectCell;
