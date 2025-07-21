// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';
import { setVolumeSort, setVolumeTableOption } from 'Store/Slices/VolumeIndex';

// Misc
import { useSelect } from 'App/SelectContext';
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';

// Specific Components
import VolumeIndexTableOptions from './VolumeIndexTableOptions';

// CSS
import styles from './VolumeIndexTableHeader.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { CheckInputChanged } from 'typings/inputs';
import type { IndexSort } from '..';
import type { TableOptionsChangePayload } from 'typings/Table';

interface VolumeIndexTableHeaderProps {
    columns: Column[];
    sortKey?: string;
    sortDirection?: SortDirection;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

function VolumeIndexTableHeader({
    columns,
    sortKey,
    sortDirection,
    isSelectMode,
}: VolumeIndexTableHeaderProps) {
    const dispatch = useRootDispatch();
    const [selectState, selectDispatch] = useSelect();

    const onSortPress = useCallback(
        (value: string) => {
            dispatch(setVolumeSort(value as IndexSort));
        },
        [dispatch],
    );

    const onTableOptionChange = useCallback(
        (payload: TableOptionsChangePayload) => {
            dispatch(setVolumeTableOption(payload));
        },
        [dispatch],
    );

    const onSelectAllChange = useCallback(
        ({ value }: CheckInputChanged) => {
            selectDispatch({
                type: value ? 'selectAll' : 'unselectAll',
            });
        },
        [selectDispatch],
    );

    return (
        <VirtualTableHeader>
            {isSelectMode ? (
                <VirtualTableSelectAllHeaderCell
                    allSelected={selectState.allSelected}
                    allUnselected={selectState.allUnselected}
                    onSelectAllChange={onSelectAllChange}
                />
            ) : null}

            {columns.map((column) => {
                const { name, label, isSortable, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'actions') {
                    return (
                        <VirtualTableHeaderCell
                            key={name}
                            className={styles[name]}
                            name={name}
                            isSortable={false}
                        >
                            <TableOptionsModalWrapper
                                columns={columns}
                                optionsComponent={VolumeIndexTableOptions}
                                onTableOptionChange={onTableOptionChange}
                            >
                                <IconButton name={icons.ADVANCED_SETTINGS} />
                            </TableOptionsModalWrapper>
                        </VirtualTableHeaderCell>
                    );
                }

                return (
                    <VirtualTableHeaderCell
                        key={name}
                        className={classNames(styles[name as keyof typeof styles])}
                        name={name}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        isSortable={isSortable}
                        onSortPress={onSortPress}
                    >
                        {typeof label === 'function' ? label() : label}
                    </VirtualTableHeaderCell>
                );
            })}
        </VirtualTableHeader>
    );
}

export default VolumeIndexTableHeader;
