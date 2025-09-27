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
import type { EmptyObject } from 'type-fest';

interface TableOptionsModalWrapperProps<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
    ExtraOptions extends object = EmptyObject,
> extends Omit<
        TableOptionsModalProps<T, K, ExtraOptions>,
        'isOpen' | 'onModalClose'
    > {
    columns: Column<T>[];
    children: ReactElement<LinkProps>;
}

// IMPLEMENTATIONS

export default function TableOptionsModalWrapper<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
    ExtraOptions extends object = EmptyObject,
>({
    columns,
    children,
    ...otherProps
}: TableOptionsModalWrapperProps<T, K, ExtraOptions>) {
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
