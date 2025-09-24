// IMPORTS

// React
import React from 'react';

// General Components
import Scroller from 'Components/Scroller/Scroller';

// CSS
import styles from './index.module.css';

// Types
import type { ScrollDirection } from 'Helpers/Props/scrollDirections';

interface ModalBodyProps {
    className?: string;
    innerClassName?: string;
    children?: React.ReactNode;
    scrollDirection?: ScrollDirection;
}

// IMPLEMENTATIONS

export default function ModalBody({
    innerClassName = styles.innerModalBody,
    scrollDirection = 'vertical',
    children,
    ...otherProps
}: ModalBodyProps) {
    let className = otherProps.className;
    const hasScroller = scrollDirection !== 'none';

    if (!className) {
        className = hasScroller ? styles.modalScroller : styles.modalBody;
    }

    return (
        <Scroller
            {...otherProps}
            className={className}
            scrollDirection={scrollDirection}
            scrollTop={0}
        >
            {hasScroller ? (
                <div className={innerClassName}>{children}</div>
            ) : (
                children
            )}
        </Scroller>
    );
}
