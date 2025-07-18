// IMPORTS

// React
import { type RefObject, useEffect, useMemo, useRef } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';

// Redux
// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import selectTableOptions from './selectTableOptions';

// Misc
import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';

// General Components
import VirtualTable from 'Components/Table/VirtualTable';

// Specific Components
import VolumeIndexRow from './VolumeIndexRow';
import VolumeIndexTableHeader from './VolumeIndexTableHeader';

// CSS
import styles from './VolumeIndexTable.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { VolumePublicInfo } from 'Volume/Volume';

interface RowItemData {
    items: VolumePublicInfo[];
    sortKey: string;
    columns: Column[];
    isSelectMode: boolean;
}

interface VolumeIndexTableProps {
    items: VolumePublicInfo[];
    sortKey: string;
    sortDirection?: SortDirection;
    jumpToCharacter?: string;
    scrollTop?: number;
    scrollerRef: RefObject<HTMLElement>;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

// IMPLEMENTATIONS

/*
const columnsSelector = createSelector(
    (state: AppState) => state.volumeIndex.columns,
    (columns) => columns,
);
*/

function Row({ index, style, data }: ListChildComponentProps<RowItemData>) {
    const { items, sortKey, columns, isSelectMode } = data;

    if (index >= items.length) {
        return null;
    }

    const volume = items[index];

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                ...style,
            }}
            className={styles.row}
        >
            <VolumeIndexRow
                volumeId={volume.id}
                sortKey={sortKey}
                columns={columns}
                isSelectMode={isSelectMode}
            />
        </div>
    );
}

function VolumeIndexTable(props: VolumeIndexTableProps) {
    const {
        items,
        sortKey,
        sortDirection,
        jumpToCharacter,
        isSelectMode,
        isSmallScreen,
        scrollerRef,
    } = props;

    // const columns = useSelector(columnsSelector);
    // const { showBanners } = useSelector(selectTableOptions);
    const showBanners = true;
    // @ts-expect-error TODO
    const columns = [];

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
                <VolumeIndexTableHeader
                    showBanners={showBanners}
                    // @ts-expect-error TODO
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
                // @ts-expect-error TODO
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

export default VolumeIndexTable;
