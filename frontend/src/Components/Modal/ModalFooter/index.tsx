// IMPORTS

// React
import React, { type ForwardedRef, forwardRef, type ReactNode } from 'react';

// CSS
import styles from './index.module.css';

// Types
interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

// IMPLEMENTATIONS

const ModalFooter = forwardRef(
    (
        { children, ...otherProps }: ModalFooterProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        return (
            <div ref={ref} className={styles.modalFooter} {...otherProps}>
                {children}
            </div>
        );
    },
);

export default ModalFooter;
