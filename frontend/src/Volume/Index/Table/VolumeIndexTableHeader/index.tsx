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
import VolumeIndexTableOptions from '../VolumeIndexTableOptions';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { CheckInputChanged } from 'typings/Inputs';
import type { IndexSort } from '../..';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { VolumeColumnName } from 'Volume/Volume';

interface VolumeIndexTableHeaderProps {
    columns: Column<VolumeColumnName>[];
    sortKey?: string;
    sortDirection?: SortDirection;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

export default function VolumeIndexTableHeader({
    columns,
    sortKey,
    sortDirection,
    isSelectMode,
}: VolumeIndexTableHeaderProps) {
    const dispatch = useRootDispatch();
    const [selectState, selectDispatch] = useSelect();

    const onSortPress = useCallback(
        (sortKey: string) => {
            dispatch(setVolumeSort({ sortKey: sortKey as IndexSort }));
        },
        [dispatch],
    );

    const onTableOptionChange = useCallback(
        (payload: TableOptionsChangePayload<VolumeColumnName>) => {
            dispatch(setVolumeTableOption(payload));
        },
        [dispatch],
    );

    const onSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
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
                        className={classNames(
                            styles[name as keyof typeof styles],
                        )}
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
