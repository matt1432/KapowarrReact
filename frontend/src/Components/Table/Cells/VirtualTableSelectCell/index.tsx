// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import CheckInput from 'Components/Form/CheckInput';

// Specific Components
import VirtualTableRowCell, {
    type VirtualTableRowCellProps,
} from '../VirtualTableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';
import type { SelectStateInputProps } from 'typings/Inputs';

interface VirtualTableSelectCellProps extends VirtualTableRowCellProps {
    inputClassName?: string;
    id: number | string;
    isSelected?: boolean;
    isDisabled: boolean;
    onSelectedChange: (options: SelectStateInputProps) => void;
}

// IMPLEMENTATIONS

export default function VirtualTableSelectCell({
    inputClassName = styles.input,
    id,
    isSelected = false,
    isDisabled,
    onSelectedChange,
    ...otherProps
}: VirtualTableSelectCellProps) {
    const handleChange = useCallback(
        ({ value, shiftKey }: CheckInputChanged<string>) => {
            onSelectedChange({ id, value, shiftKey });
        },
        [id, onSelectedChange],
    );

    return (
        <VirtualTableRowCell className={styles.cell} {...otherProps}>
            <CheckInput
                className={inputClassName}
                name={id.toString()}
                value={isSelected}
                isDisabled={isDisabled}
                onChange={handleChange}
            />
        </VirtualTableRowCell>
    );
}
