// IMPORTS

// React
import React, { type CSSProperties, type LegacyRef, useId } from 'react';

// General Components
import Scroller from 'Components/Scroller/Scroller';

// CSS
import styles from './MenuContent.module.css';

// Types
interface MenuContentProps {
    forwardedRef?: LegacyRef<HTMLDivElement> | undefined;
    className?: string;
    id?: string;
    children: React.ReactNode;
    style?: CSSProperties;
    isOpen?: boolean;
}

// IMPLEMENTATIONS

function MenuContent({
    forwardedRef,
    className = styles.menuContent,
    id,
    children,
    style,
    isOpen,
}: MenuContentProps) {
    const generatedId = useId();

    return (
        <div ref={forwardedRef} id={id ?? generatedId} className={className} style={style}>
            {isOpen ? <Scroller className={styles.scroller}>{children}</Scroller> : null}
        </div>
    );
}

export default MenuContent;
