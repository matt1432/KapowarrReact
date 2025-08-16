// IMPORTS

// React
import { useMemo } from 'react';

// General Components
import CheckInput from 'Components/Form/CheckInput';

// Specific Components
import VirtualTableHeaderCell from '../TableHeaderCell';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';

interface TableSelectAllHeaderCellProps {
    allSelected: boolean;
    allUnselected: boolean;
    onSelectAllChange: (change: CheckInputChanged) => void;
}

// IMPLEMENTATIONS

function TableSelectAllHeaderCell({
    allSelected,
    allUnselected,
    onSelectAllChange,
}: TableSelectAllHeaderCellProps) {
    const value = useMemo(() => {
        if (allSelected) {
            return true;
        }
        else if (allUnselected) {
            return false;
        }

        return null;
    }, [allSelected, allUnselected]);

    return (
        <VirtualTableHeaderCell className={styles.selectAllHeaderCell} name="selectAll">
            <CheckInput
                className={styles.input}
                name="selectAll"
                value={value}
                onChange={onSelectAllChange}
            />
        </VirtualTableHeaderCell>
    );
}

export default TableSelectAllHeaderCell;
