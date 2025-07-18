// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useDispatch } from 'react-redux';
// import { setVolumeSort, setVolumeTableOption } from 'Store/Actions/volumeIndexActions';
// import hasGrowableColumns from './hasGrowableColumns';

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

interface VolumeIndexTableHeaderProps {
    showBanners: boolean;
    columns: Column[];
    sortKey?: string;
    sortDirection?: SortDirection;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

function VolumeIndexTableHeader(props: VolumeIndexTableHeaderProps) {
    const { showBanners, columns, sortKey, sortDirection, isSelectMode } = props;
    const dispatch = useDispatch();
    const [selectState, selectDispatch] = useSelect();

    const onSortPress = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (value: string) => {
            // dispatch(setVolumeSort({ sortKey: value }));
        },
        [dispatch],
    );

    const onTableOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setVolumeTableOption(payload));
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
                        className={classNames(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            styles[name],
                            name === 'sortTitle' && showBanners && styles.banner,
                            name === 'sortTitle' &&
                                showBanners &&
                                // !hasGrowableColumns(columns) &&
                                styles.bannerGrow,
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

export default VolumeIndexTableHeader;
