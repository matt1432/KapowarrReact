// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';
import {
    setVolumeTableOption,
    type VolumeIndexState,
} from 'Store/Slices/VolumeIndex';
import {
    setTableSort,
    type SetTableOptionsParams,
} from 'Store/Slices/TableOptions';

// Misc
import { icons } from 'Helpers/Props';

import translate, { type TranslateKey } from 'Utilities/String/translate';

import classNames from 'classnames';

// Hooks
import { useSelect } from 'App/SelectContext';

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
import type { VolumeColumnName } from 'Volume/Volume';

interface VolumeIndexTableHeaderProps {
    columns: Column<VolumeColumnName>[];
    sortKey?: IndexSort | null;
    sortDirection?: SortDirection | null;
    secondarySortKey?: IndexSort | null;
    secondarySortDirection?: SortDirection | null;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

export default function VolumeIndexTableHeader({
    columns,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
    isSelectMode,
}: VolumeIndexTableHeaderProps) {
    const dispatch = useRootDispatch();
    const [selectState, selectDispatch] = useSelect();

    const onSortPress = useCallback(
        (newSortKey: string) => {
            dispatch(
                setTableSort({
                    tableName: 'volumeIndex',
                    sortKey: newSortKey as IndexSort,
                }),
            );
        },
        [dispatch],
    );

    const onTableOptionChange = useCallback(
        (
            payload: Partial<
                SetTableOptionsParams<'volumeIndex'> &
                    VolumeIndexState['tableOptions']
            >,
        ) => {
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
                const { name, isSortable, isVisible } = column;

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
                                tableName="volumeIndex"
                                columns={columns}
                                optionsComponent={VolumeIndexTableOptions}
                                onTableOptionChange={onTableOptionChange}
                            >
                                <IconButton name={icons.ADVANCED_SETTINGS} />
                            </TableOptionsModalWrapper>
                        </VirtualTableHeaderCell>
                    );
                }
                const columnLabel = translate(
                    `${column.name}Key` as TranslateKey,
                );

                return (
                    <VirtualTableHeaderCell
                        key={name}
                        className={classNames(styles[name])}
                        name={name}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        secondarySortKey={secondarySortKey}
                        secondarySortDirection={secondarySortDirection}
                        isSortable={isSortable}
                        onSortPress={onSortPress}
                    >
                        {column.hideHeaderLabel ? '' : columnLabel}
                    </VirtualTableHeaderCell>
                );
            })}
        </VirtualTableHeader>
    );
}
