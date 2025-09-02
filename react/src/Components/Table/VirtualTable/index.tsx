// IMPORTS

// React
import React, { type RefObject, useEffect, useState } from 'react';
import { List, type ListImperativeAPI, type RowComponentProps } from 'react-window';

// Misc
import { throttle } from 'lodash';

import useMeasure from 'Helpers/Hooks/useMeasure';

// General Components
import Scroller from 'Components/Scroller/Scroller';

// CSS
import dimensions from 'Styles/Variables/dimensions';
import styles from './index.module.css';

// Types
import type { ExtendableRecord } from 'typings/Misc';

interface VirtualTableProps<T extends ExtendableRecord> {
    Header: React.JSX.Element;
    itemCount: number;
    itemData: T;
    isSmallScreen: boolean;
    listRef: RefObject<ListImperativeAPI>;
    rowHeight: number;
    Row(props: RowComponentProps<T>): React.JSX.Element | null;
    scrollerRef: RefObject<HTMLElement>;
}

// IMPLEMENTATIONS

const bodyPadding = parseInt(dimensions.pageContentBodyPadding);
const bodyPaddingSmallScreen = parseInt(dimensions.pageContentBodyPaddingSmallScreen);

function getWindowScrollTopPosition() {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function VirtualTable<T extends ExtendableRecord>({
    Header,
    itemCount,
    itemData,
    isSmallScreen,
    listRef,
    rowHeight,
    Row,
    scrollerRef,
}: VirtualTableProps<T>) {
    const [measureRef, bounds] = useMeasure();
    const [size, setSize] = useState({ width: 0, height: 0 });
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    useEffect(() => {
        const current = scrollerRef?.current as HTMLElement;

        if (isSmallScreen) {
            setSize({
                width: windowWidth,
                height: windowHeight,
            });

            return;
        }

        if (current) {
            const width = current.clientWidth;
            const padding = (isSmallScreen ? bodyPaddingSmallScreen : bodyPadding) - 5;

            setSize({
                width: width - padding * 2,
                height: windowHeight,
            });
        }
    }, [isSmallScreen, windowWidth, windowHeight, scrollerRef, bounds]);

    useEffect(() => {
        const currentScrollerRef = scrollerRef.current as HTMLElement;
        const currentScrollListener = isSmallScreen ? window : currentScrollerRef;

        const handleScroll = throttle(() => {
            const { offsetTop = 0 } = currentScrollerRef;
            const scrollTop =
                (isSmallScreen ? getWindowScrollTopPosition() : currentScrollerRef.scrollTop) -
                offsetTop;

            listRef.current?.element?.scrollTo(0, scrollTop);
        }, 10);

        currentScrollListener.addEventListener('scroll', handleScroll);

        return () => {
            handleScroll.cancel();

            if (currentScrollListener) {
                currentScrollListener.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isSmallScreen, listRef, scrollerRef]);

    return (
        <div ref={measureRef}>
            <Scroller className={styles.tableScroller} scrollDirection="horizontal">
                {Header}
                <List<T>
                    listRef={listRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'none',
                    }}
                    defaultHeight={size.height}
                    rowCount={itemCount}
                    rowHeight={rowHeight}
                    rowProps={itemData}
                    rowComponent={Row}
                    overscanCount={20}
                />
            </Scroller>
        </div>
    );
}

export default VirtualTable;
