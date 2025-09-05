// IMPORTS

// React
import { type RefObject, useEffect, useMemo, useState } from 'react';
import { Grid, useGridRef, type CellComponentProps } from 'react-window';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Misc
import { throttle } from 'lodash';

import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';

// Hooks
import useMeasure from 'Helpers/Hooks/useMeasure';

// General Components

// Specific Components
import VolumeIndexPoster from 'Volume/Index/Posters/VolumeIndexPoster';

// CSS
import dimensions from 'Styles/Variables/dimensions';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { VolumePublicInfo } from 'Volume/Volume';
import type { IndexSort } from '..';
import type { Size } from 'Helpers/Props/sizes';

interface CellItemData {
    layout: {
        columnCount: number;
        padding: number;
        posterWidth: number;
        posterHeight: number;
    };
    items: VolumePublicInfo[];
    sortKey: IndexSort;
    isSelectMode: boolean;
}

interface VolumeIndexPostersProps {
    items: VolumePublicInfo[];
    sortKey: IndexSort;
    sortDirection?: SortDirection;
    jumpToCharacter?: string;
    scrollTop?: number;
    scrollerRef: RefObject<HTMLElement>;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

// IMPLEMENTATIONS

const bodyPadding = parseInt(dimensions.pageContentBodyPadding);
const bodyPaddingSmallScreen = parseInt(dimensions.pageContentBodyPaddingSmallScreen);
const columnPadding = parseInt(dimensions.volumeIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.volumeIndexColumnPaddingSmallScreen);
const progressBarHeight = parseInt(dimensions.progressBarSmallHeight);
const detailedProgressBarHeight = parseInt(dimensions.progressBarMediumHeight);

const ADDITIONAL_COLUMN_COUNT = {
    small: 3,
    medium: 2,
    large: 1,
} as Record<Size, number>;

const EXTRA_ROW_HEIGHT = 19;

function Cell({
    columnIndex,
    rowIndex,
    style,
    layout,
    items,
    sortKey,
    isSelectMode,
}: CellComponentProps<CellItemData>) {
    const { columnCount, padding, posterWidth, posterHeight } = layout;
    const index = rowIndex * columnCount + columnIndex;

    if (index >= items.length) {
        return null;
    }

    const volume = items[index];

    return (
        <div
            style={{
                padding,
                ...style,
            }}
        >
            <VolumeIndexPoster
                volumeId={volume.id}
                sortKey={sortKey}
                isSelectMode={isSelectMode}
                posterWidth={posterWidth}
                posterHeight={posterHeight}
            />
        </div>
    );
}

function getWindowScrollTopPosition() {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export default function VolumeIndexPosters({
    scrollerRef,
    items,
    sortKey,
    jumpToCharacter,
    isSelectMode,
    isSmallScreen,
}: VolumeIndexPostersProps) {
    const { posterOptions } = useRootSelector((state) => state.volumeIndex);
    const ref = useGridRef(null);
    const [measureRef, bounds] = useMeasure();
    const [size, setSize] = useState({ width: 0, height: 0 });

    const columnWidth = useMemo(() => {
        const { width } = size;
        const maximumColumnWidth = isSmallScreen ? 172 : 182;
        const columns = Math.floor(width / maximumColumnWidth);
        const remainder = width % maximumColumnWidth;
        return remainder === 0
            ? maximumColumnWidth
            : Math.floor(width / (columns + ADDITIONAL_COLUMN_COUNT[posterOptions.size]));
    }, [isSmallScreen, posterOptions, size]);

    const columnCount = useMemo(
        () => Math.max(Math.floor(size.width / columnWidth), 1),
        [size, columnWidth],
    );
    const padding = useMemo(
        () => (isSmallScreen ? columnPaddingSmallScreen : columnPadding),
        [isSmallScreen],
    );
    const posterWidth = useMemo(() => columnWidth - padding * 2, [columnWidth, padding]);
    const posterHeight = useMemo(() => Math.ceil((250 / 170) * posterWidth), [posterWidth]);

    const rowHeight = useMemo(() => {
        const { detailedProgressBar, showFolder, showMonitored, showSizeOnDisk, showTitle } =
            posterOptions;

        const heights = [
            posterHeight,
            detailedProgressBar ? detailedProgressBarHeight : progressBarHeight,
            EXTRA_ROW_HEIGHT,
            isSmallScreen ? columnPaddingSmallScreen : columnPadding,
        ];

        if (showFolder) {
            heights.push(EXTRA_ROW_HEIGHT);
        }

        if (showMonitored) {
            heights.push(EXTRA_ROW_HEIGHT);
        }

        if (showSizeOnDisk) {
            heights.push(EXTRA_ROW_HEIGHT);
        }

        if (showTitle) {
            heights.push(EXTRA_ROW_HEIGHT);
        }

        switch (sortKey) {
            case 'year':
            case 'volumeNumber':
            case 'publisher':
                heights.push(EXTRA_ROW_HEIGHT);
                break;
            default:
            // No need to add a height of 0
        }

        return heights.reduce((acc, height) => acc + height, 0);
    }, [isSmallScreen, posterOptions, sortKey, posterHeight]);

    useEffect(() => {
        const current = scrollerRef.current;

        if (isSmallScreen) {
            const padding = bodyPaddingSmallScreen - 5;
            const width = window.innerWidth - padding * 2;
            const height = window.innerHeight;

            if (width !== size.width || height !== size.height) {
                setSize({
                    width,
                    height,
                });
            }

            return;
        }

        if (current) {
            const width = current.clientWidth;
            const padding = bodyPadding - 5;
            const finalWidth = width - padding * 2;

            if (Math.abs(size.width - finalWidth) < 20 || size.width === finalWidth) {
                return;
            }

            setSize({
                width: finalWidth,
                height: window.innerHeight,
            });
        }
    }, [isSmallScreen, size, scrollerRef, bounds]);

    useEffect(() => {
        const currentScrollerRef = scrollerRef.current as HTMLElement;
        const currentScrollListener = isSmallScreen ? window : currentScrollerRef;

        const handleScroll = throttle(() => {
            const { offsetTop = 0 } = currentScrollerRef;
            const scrollTop =
                (isSmallScreen ? getWindowScrollTopPosition() : currentScrollerRef.scrollTop) -
                offsetTop;

            ref.current?.element?.scrollTo(0, scrollTop);
        }, 10);

        currentScrollListener.addEventListener('scroll', handleScroll);

        return () => {
            handleScroll.cancel();

            if (currentScrollListener) {
                currentScrollListener.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isSmallScreen, ref, scrollerRef]);

    useEffect(() => {
        if (jumpToCharacter) {
            const index = getIndexOfFirstCharacter(items, jumpToCharacter);

            if (index !== null) {
                const rowIndex = Math.floor(index / columnCount);

                const scrollTop = rowIndex * rowHeight + padding;

                ref.current?.element?.scrollTo(0, scrollTop);
                scrollerRef.current?.scrollTo(0, scrollTop);
            }
        }
    }, [jumpToCharacter, rowHeight, columnCount, padding, items, scrollerRef, ref]);

    return (
        <div ref={measureRef}>
            <Grid<CellItemData>
                gridRef={ref}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'none',
                }}
                defaultWidth={size.width}
                defaultHeight={size.height}
                columnCount={columnCount}
                columnWidth={columnWidth}
                overscanCount={5}
                rowCount={Math.ceil(items.length / columnCount)}
                rowHeight={rowHeight}
                cellProps={{
                    layout: {
                        columnCount,
                        padding,
                        posterWidth,
                        posterHeight,
                    },
                    items,
                    sortKey,
                    isSelectMode,
                }}
                cellComponent={Cell}
            />
        </div>
    );
}
