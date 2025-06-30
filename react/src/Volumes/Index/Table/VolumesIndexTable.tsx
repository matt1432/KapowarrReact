import { type RefObject, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type Column } from 'Components/Table/Column';
import VirtualTable from 'Components/Table/VirtualTable';
import { type SortDirection } from 'Helpers/Props/sortDirections';
import { type Volumes } from 'Volumes/Volumes';
import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';
import selectTableOptions from './selectTableOptions';
import VolumesIndexRow from './VolumesIndexRow';
import VolumesIndexTableHeader from './VolumesIndexTableHeader';
import styles from './VolumesIndexTable.module.css';

interface RowItemData {
    items: Volumes[];
    sortKey: string;
    columns: Column[];
    isSelectMode: boolean;
}

interface VolumesIndexTableProps {
    items: Volumes[];
    sortKey: string;
    sortDirection?: SortDirection;
    jumpToCharacter?: string;
    scrollTop?: number;
    scrollerRef: RefObject<HTMLElement>;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

const columnsSelector = createSelector(
    (state: AppState) => state.volumesIndex.columns,
    (columns) => columns,
);

function Row({ index, style, data }: ListChildComponentProps<RowItemData>) {
    const { items, sortKey, columns, isSelectMode } = data;

    if (index >= items.length) {
        return null;
    }

    const volumes = items[index];

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                ...style,
            }}
            className={styles.row}
        >
            <VolumesIndexRow
                volumesId={volumes.id}
                sortKey={sortKey}
                columns={columns}
                isSelectMode={isSelectMode}
            />
        </div>
    );
}

function VolumesIndexTable(props: VolumesIndexTableProps) {
    const {
        items,
        sortKey,
        sortDirection,
        jumpToCharacter,
        isSelectMode,
        isSmallScreen,
        scrollerRef,
    } = props;

    const columns = useSelector(columnsSelector);
    const { showBanners } = useSelector(selectTableOptions);
    const listRef = useRef<FixedSizeList<RowItemData>>(undefined) as RefObject<
        FixedSizeList<RowItemData>
    >;

    const rowHeight = useMemo(() => {
        return showBanners ? 70 : 38;
    }, [showBanners]);

    useEffect(() => {
        if (jumpToCharacter) {
            const index = getIndexOfFirstCharacter(items, jumpToCharacter);

            if (index != null) {
                let scrollTop = index * rowHeight;

                // If the offset is zero go to the top, otherwise offset
                // by the approximate size of the header + padding (37 + 20).
                if (scrollTop > 0) {
                    const offset = 57;

                    scrollTop += offset;
                }

                listRef.current?.scrollTo(scrollTop);
                scrollerRef?.current?.scrollTo(0, scrollTop);
            }
        }
    }, [jumpToCharacter, rowHeight, items, scrollerRef, listRef]);

    return (
        <VirtualTable
            Header={
                <VolumesIndexTableHeader
                    showBanners={showBanners}
                    columns={columns}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    isSelectMode={isSelectMode}
                />
            }
            itemCount={items.length}
            itemData={{
                items,
                sortKey,
                columns,
                isSelectMode,
            }}
            isSmallScreen={isSmallScreen}
            listRef={listRef}
            rowHeight={rowHeight}
            Row={Row}
            scrollerRef={scrollerRef}
        />
    );
}

export default VolumesIndexTable;
