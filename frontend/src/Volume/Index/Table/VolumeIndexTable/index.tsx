// IMPORTS

// React
import { useEffect, type RefObject } from 'react';
import {
    useListRef,
    type ListImperativeAPI,
    type RowComponentProps,
} from 'react-window';

// Redux
import { useRootSelector } from 'Store/createAppStore';

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
import type { VolumeColumnName, VolumePublicInfo } from 'Volume/Volume';

interface RowItemData {
    items: VolumePublicInfo[];
    columns: Column<VolumeColumnName>[];
    isSelectMode: boolean;
}

interface VolumeIndexTableProps {
    items: VolumePublicInfo[];
    jumpToCharacter?: string;
    scrollTop?: number;
    scrollerRef: RefObject<HTMLElement>;
    isSelectMode: boolean;
    isSmallScreen: boolean;
    columns: Column<VolumeColumnName>[];
}

// IMPLEMENTATIONS

function Row({
    index,
    style,
    columns,
    items,
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
                volume={volume}
                columns={columns}
                isSelectMode={isSelectMode}
            />
        </div>
    );
}

export default function VolumeIndexTable({
    items,
    jumpToCharacter,
    isSelectMode,
    isSmallScreen,
    scrollerRef,
    columns,
}: VolumeIndexTableProps) {
    const { sortKey, sortDirection, secondarySortKey, secondarySortDirection } =
        useRootSelector((state) => state.tableOptions.volumeIndex);

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

                listRef.current?.element?.scrollTo(0, scrollTop);
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
                    secondarySortKey={secondarySortKey}
                    secondarySortDirection={secondarySortDirection}
                    isSelectMode={isSelectMode}
                />
            }
            itemCount={items.length}
            itemData={{
                items,
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
