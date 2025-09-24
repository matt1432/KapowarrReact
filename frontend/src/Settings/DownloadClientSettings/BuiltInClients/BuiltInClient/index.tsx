// IMPORTS

// React
import { useCallback, useState, type ReactNode } from 'react';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Card from 'Components/Card';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import EditBuiltInClientModal from '../EditBuiltInClient';

// CSS
import styles from './index.module.css';

// Types
import type { BuiltInType } from 'typings/DownloadClient';

interface BuiltInClientProps {
    title: BuiltInType;
    children: (onModalClose: () => void) => ReactNode;
}

// IMPLEMENTATIONS

export default function BuiltInClient({ title, children }: BuiltInClientProps) {
    const [isEditBuiltInClientModalOpen, setIsEditBuiltInClientModalOpen] =
        useState(false);

    const handleEditBuiltInClientPress = useCallback(() => {
        setIsEditBuiltInClientModalOpen(true);
    }, []);

    const handleEditBuiltInClientModalClose = useCallback(() => {
        setIsEditBuiltInClientModalOpen(false);
    }, []);

    return (
        <Card
            className={styles.builtInClient}
            overlayContent={true}
            onPress={handleEditBuiltInClientPress}
        >
            <div className={styles.name}>{title}</div>

            <EditBuiltInClientModal
                isOpen={isEditBuiltInClientModalOpen}
                onModalClose={handleEditBuiltInClientModalClose}
            >
                <ModalHeader>
                    {translate('EditDownloadClientImplementation', {
                        implementationName: title,
                    })}
                </ModalHeader>
                {children(handleEditBuiltInClientModalClose)}
            </EditBuiltInClientModal>
        </Card>
    );
}
