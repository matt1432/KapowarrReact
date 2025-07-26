// IMPORTS

// React
import { type RefObject, useEffect, useRef } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';

// Redux
import { useRootSelector } from 'Store/createAppStore';

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
import type { VolumeColumnName, VolumePublicInfo } from 'Volume/Volume';

interface RowItemData {
    items: VolumePublicInfo[];
    sortKey: string;
    columns: Column<VolumeColumnName>[];
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

function VolumeIndexTable({
    items,
    sortKey,
    sortDirection,
    jumpToCharacter,
    isSelectMode,
    isSmallScreen,
    scrollerRef,
}: VolumeIndexTableProps) {
    const { columns } = useRootSelector((state) => state.volumeIndex);

    const listRef = useRef<FixedSizeList<RowItemData>>(undefined) as RefObject<
        FixedSizeList<RowItemData>
    >;

    useEffect(() => {
        if (jumpToCharacter) {
            const index = getIndexOfFirstCharacter(items, jumpToCharacter);

            if (index != null) {
                let scrollTop = index * 38;

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
    }, [jumpToCharacter, items, scrollerRef, listRef]);

    return (
        <VirtualTable
            Header={
                <VolumeIndexTableHeader
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
            rowHeight={38}
            Row={Row}
            scrollerRef={scrollerRef}
        />
    );
}

export default VolumeIndexTable;
