// IMPORTS

// React
import React, { type ComponentPropsWithoutRef, useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-4';

// CSS
import styles from './index.module.css';

// Types
import type { ScrollDirection } from 'Helpers/Props/scrollDirections';
import type { OnScroll } from '../Scroller';

interface OverlayScrollerProps {
    className?: string;
    trackClassName?: string;
    scrollTop?: number;
    scrollDirection: ScrollDirection;
    autoHide?: boolean;
    autoScroll?: boolean;
    children?: React.ReactNode;
    onScroll?: (payload: OnScroll) => void;
}

interface ScrollbarTrackProps {
    style: React.CSSProperties;
    props: ComponentPropsWithoutRef<'div'>;
}

// IMPLEMENTATIONS

const SCROLLBAR_SIZE = 10;

function OverlayScroller({
    autoHide = false,
    autoScroll = true,
    className = styles.scroller,
    trackClassName = styles.thumb,
    children,
    onScroll,
}: OverlayScrollerProps) {
    const scrollBarRef = useRef<Scrollbars>(null);
    const isScrolling = useRef(false);

    const handleScrollStart = useCallback(() => {
        isScrolling.current = true;
    }, []);
    const handleScrollStop = useCallback(() => {
        isScrolling.current = false;
    }, []);

    const handleScroll = useCallback(() => {
        if (!scrollBarRef.current) {
            return;
        }

        const { scrollTop, scrollLeft } = scrollBarRef.current.getValues();
        isScrolling.current = true;

        if (onScroll) {
            onScroll({ scrollTop, scrollLeft });
        }
    }, [onScroll]);

    const renderThumb = useCallback(
        (props: ComponentPropsWithoutRef<'div'>) => {
            return <div className={trackClassName} {...props} />;
        },
        [trackClassName],
    );

    const renderTrackHorizontal = useCallback(
        ({ style, props: trackProps }: ScrollbarTrackProps) => {
            const finalStyle = {
                ...style,
                right: 2,
                bottom: 2,
                left: 2,
                borderRadius: 3,
                height: SCROLLBAR_SIZE,
            };

            return <div className={styles.track} style={finalStyle} {...trackProps} />;
        },
        [],
    );

    const renderTrackVertical = useCallback(({ style, props: trackProps }: ScrollbarTrackProps) => {
        const finalStyle = {
            ...style,
            right: 2,
            bottom: 2,
            top: 2,
            borderRadius: 3,
            width: SCROLLBAR_SIZE,
        };

        return <div className={styles.track} style={finalStyle} {...trackProps} />;
    }, []);

    const renderView = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (props: any) => {
            return <div className={className} {...props} />;
        },
        [className],
    );

    return (
        <Scrollbars
            ref={scrollBarRef}
            autoHide={autoHide}
            hideTracksWhenNotNeeded={autoScroll}
            renderTrackHorizontal={renderTrackHorizontal}
            renderTrackVertical={renderTrackVertical}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            renderView={renderView}
            onScrollStart={handleScrollStart}
            onScrollStop={handleScrollStop}
            onScroll={handleScroll}
        >
            {children}
        </Scrollbars>
    );
}

export default OverlayScroller;
