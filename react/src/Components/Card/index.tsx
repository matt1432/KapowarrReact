// IMPORTS

// React
import React from 'react';

// General Components
import Link, { type LinkProps } from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
interface CardProps extends Pick<LinkProps, 'onPress'> {
    className?: string;
    overlayClassName?: string;
    overlayContent?: boolean;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

function Card(props: CardProps) {
    const {
        className = styles.card,
        overlayClassName = styles.overlay,
        overlayContent = false,
        children,
        onPress,
    } = props;

    if (overlayContent) {
        return (
            <div className={className}>
                <Link className={styles.underlay} onPress={onPress} />

                <div className={overlayClassName}>{children}</div>
            </div>
        );
    }

    return (
        <Link className={className} onPress={onPress}>
            {children}
        </Link>
    );
}

export default Card;
