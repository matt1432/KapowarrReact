// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
    showCloseButton?: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function ModalContent({
    className = styles.modalContent,
    children,
    showCloseButton = true,
    onModalClose,
    ...otherProps
}: ModalContentProps) {
    return (
        <div className={className} {...otherProps}>
            {showCloseButton && (
                <Link className={styles.closeButton} onPress={onModalClose}>
                    <Icon name={icons.CLOSE} size={18} title={translate('Close')} />
                </Link>
            )}

            {children}
        </div>
    );
}
