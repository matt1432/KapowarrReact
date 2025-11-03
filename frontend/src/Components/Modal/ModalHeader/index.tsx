// IMPORTS

// React
import { forwardRef } from 'react';

// CSS
import styles from './index.module.css';

// Types
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react';

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

// IMPLEMENTATIONS

const ModalHeader = forwardRef(
    (
        { children, ...otherProps }: ModalHeaderProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        return (
            <div ref={ref} className={styles.modalHeader} {...otherProps}>
                {children}
            </div>
        );
    },
);

export default ModalHeader;
