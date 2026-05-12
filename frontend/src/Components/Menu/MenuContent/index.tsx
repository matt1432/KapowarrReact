// IMPORTS

// React
import React, { type CSSProperties, type RefObject, useId } from 'react';

// General Components
import Scroller, { type ScrollerProps } from 'Components/Scroller/Scroller';

// Misc
import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
interface MenuContentProps {
    ref?: RefObject<HTMLDivElement> | undefined;
    className?: string;
    id?: string;
    children: React.ReactNode;
    style?: CSSProperties;
    isOpen?: boolean;
    scrollerProps?: ScrollerProps;
}

// IMPLEMENTATIONS

export default function MenuContent({
    ref,
    className = styles.menuContent,
    id,
    children,
    style,
    isOpen,
    scrollerProps = {},
}: MenuContentProps) {
    const generatedId = useId();

    return (
        <div
            ref={ref}
            id={id ?? generatedId}
            className={className}
            style={style}
        >
            {isOpen ? (
                <Scroller
                    {...scrollerProps}
                    className={classNames(
                        styles.scroller,
                        scrollerProps.className,
                    )}
                >
                    {children}
                </Scroller>
            ) : null}
        </div>
    );
}
