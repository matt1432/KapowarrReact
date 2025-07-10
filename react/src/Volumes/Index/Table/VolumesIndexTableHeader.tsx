import classNames from 'classnames';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelect } from 'App/SelectContext';
import IconButton from 'Components/Link/IconButton';
import { type Column } from 'Components/Table/Column';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';
import { icons } from 'Helpers/Props';
import { type SortDirection } from 'Helpers/Props/sortDirections';
// import { setVolumesSort, setVolumesTableOption } from 'Store/Actions/volumesIndexActions';
import { type CheckInputChanged } from 'typings/inputs';
// import hasGrowableColumns from './hasGrowableColumns';
import VolumesIndexTableOptions from './VolumesIndexTableOptions';
import styles from './VolumesIndexTableHeader.module.css';

interface VolumesIndexTableHeaderProps {
    showBanners: boolean;
    columns: Column[];
    sortKey?: string;
    sortDirection?: SortDirection;
    isSelectMode: boolean;
}

function VolumesIndexTableHeader(props: VolumesIndexTableHeaderProps) {
    const { showBanners, columns, sortKey, sortDirection, isSelectMode } = props;
    const dispatch = useDispatch();
    const [selectState, selectDispatch] = useSelect();

    const onSortPress = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (value: string) => {
            // dispatch(setVolumesSort({ sortKey: value }));
        },
        [dispatch],
    );

    const onTableOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setVolumesTableOption(payload));
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
                                optionsComponent={VolumesIndexTableOptions}
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

export default VolumesIndexTableHeader;
