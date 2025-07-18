// IMPORTS

// React
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeGrid as Grid, type GridChildComponentProps } from 'react-window';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Misc
import { throttle } from 'lodash';

import useMeasure from 'Helpers/Hooks/useMeasure';
import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';

// General Components

// Specific Components
import VolumeIndexPoster from 'Volume/Index/Posters/VolumeIndexPoster';

// CSS
import dimensions from 'Styles/Variables/dimensions';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { VolumePublicInfo } from 'Volume/Volume';
import type { IndexSort } from '..';

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

const ADDITIONAL_COLUMN_COUNT: Record<string, number> = {
    small: 3,
    medium: 2,
    large: 1,
};

function Cell({ columnIndex, rowIndex, style, data }: GridChildComponentProps<CellItemData>) {
    const { layout, items, sortKey, isSelectMode } = data;
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

export default function VolumeIndexPosters(props: VolumeIndexPostersProps) {
    const { scrollerRef, items, sortKey, jumpToCharacter, isSelectMode, isSmallScreen } = props;

    const { posterOptions } = useRootSelector((state) => state.volumeIndex);
    const ref = useRef<Grid>(null);
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
    const padding = props.isSmallScreen ? columnPaddingSmallScreen : columnPadding;
    const posterWidth = columnWidth - padding * 2;
    const posterHeight = Math.ceil((250 / 170) * posterWidth);

    const rowHeight = useMemo(() => {
        const { detailedProgressBar, showTitle, showMonitored } = posterOptions;

        const heights = [
            posterHeight,
            detailedProgressBar ? detailedProgressBarHeight : progressBarHeight,
            19,
            isSmallScreen ? columnPaddingSmallScreen : columnPadding,
        ];

        if (showTitle) {
            heights.push(19);
        }

        if (showMonitored) {
            heights.push(19);
        }

        // TODO: figure this out
        switch (sortKey) {
            case 'wanted':
            case 'title':
            case 'total_size':
            case 'folder':
            case 'publisher':
                heights.push(19);
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

            ref.current?.scrollTo({ scrollLeft: 0, scrollTop });
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

            if (index != null) {
                const rowIndex = Math.floor(index / columnCount);

                const scrollTop = rowIndex * rowHeight + padding;

                ref.current?.scrollTo({ scrollLeft: 0, scrollTop });
                scrollerRef.current?.scrollTo(0, scrollTop);
            }
        }
    }, [jumpToCharacter, rowHeight, columnCount, padding, items, scrollerRef, ref]);

    return (
        <div ref={measureRef}>
            <Grid<CellItemData>
                ref={ref}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'none',
                }}
                width={size.width}
                height={size.height}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowCount={Math.ceil(items.length / columnCount)}
                rowHeight={rowHeight}
                itemData={{
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
            >
                {Cell}
            </Grid>
        </div>
    );
}
