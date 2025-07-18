// IMPORTS

// React
import React, { type ForwardedRef, forwardRef, type ReactNode } from 'react';

// CSS
import styles from './ModalHeader.module.css';

// Types
interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

// IMPLEMENTATIONS

const ModalHeader = forwardRef(
    ({ children, ...otherProps }: ModalHeaderProps, ref: ForwardedRef<HTMLDivElement>) => {
        return (
            <div ref={ref} className={styles.modalHeader} {...otherProps}>
                {children}
            </div>
        );
    },
);

export default ModalHeader;
