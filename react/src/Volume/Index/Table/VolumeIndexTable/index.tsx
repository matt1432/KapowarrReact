// IMPORTS

// React
import { useEffect, type RefObject } from 'react';
import { useListRef, type ListImperativeAPI, type RowComponentProps } from 'react-window';

// Misc
import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';

// General Components
import VirtualTable from 'Components/Table/VirtualTable';

// Specific Components
import VolumeIndexRow from '../VolumeIndexRow';
import VolumeIndexTableHeader from '../VolumeIndexTableHeader';

// CSS
import styles from './index.module.css';

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
    columns: Column<VolumeColumnName>[];
}

// IMPLEMENTATIONS
//

function Row({
    index,
    style,
    columns,
    items,
    sortKey,
    isSelectMode,
}: RowComponentProps<RowItemData>) {
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

export default function VolumeIndexTable({
    items,
    sortKey,
    sortDirection,
    jumpToCharacter,
    isSelectMode,
    isSmallScreen,
    scrollerRef,
    columns,
}: VolumeIndexTableProps) {
    const listRef = useListRef(undefined) as RefObject<ListImperativeAPI>;

    useEffect(() => {
        if (jumpToCharacter) {
            const index = getIndexOfFirstCharacter(items, jumpToCharacter);

            if (index !== null) {
                let scrollTop = index * 38;

                // If the offset is zero go to the top, otherwise offset
                // by the approximate size of the header + padding (37 + 20).
                if (scrollTop > 0) {
                    const offset = 57;

                    scrollTop += offset;
                }

                listRef.current?.scrollToRow({ index });
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
