// IMPORTS

// React
import React, { type ReactElement, useCallback, useState } from 'react';

// Specific Components
import TableOptionsModal, {
    type TableOptionsModalProps,
} from './TableOptionsModal';

// Types
import type { LinkProps } from 'Components/Link/Link';
import type { Column } from '../Column';
import type { ColumnNameMap } from 'Store/Slices/TableOptions';

interface TableOptionsModalWrapperProps<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
> extends Omit<TableOptionsModalProps<T, K>, 'isOpen' | 'onModalClose'> {
    columns: Column<T>[];
    children: ReactElement<LinkProps>;
}

// IMPLEMENTATIONS

export default function TableOptionsModalWrapper<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
>({ columns, children, ...otherProps }: TableOptionsModalWrapperProps<T, K>) {
    const [isTableOptionsModalOpen, setIsTableOptionsModalOpen] =
        useState(false);

    const handleTableOptionsPress = useCallback(() => {
        setIsTableOptionsModalOpen(true);
    }, []);

    const handleTableOptionsModalClose = useCallback(() => {
        setIsTableOptionsModalOpen(false);
    }, []);

    return (
        <>
            {React.isValidElement(children)
                ? React.cloneElement(children, {
                      onPress: handleTableOptionsPress,
                  })
                : null}

            <TableOptionsModal
                {...otherProps}
                isOpen={isTableOptionsModalOpen}
                columns={columns}
                onModalClose={handleTableOptionsModalClose}
            />
        </>
    );
}
