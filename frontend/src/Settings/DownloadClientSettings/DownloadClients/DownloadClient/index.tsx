// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteDownloadClientMutation } from 'Store/Api/DownloadClients';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks

// General Components
import Card from 'Components/Card';
import ConfirmModal from 'Components/Modal/ConfirmModal';

// Specific Components
import EditDownloadClientModal from '../EditDownloadClient';

// CSS
import styles from './index.module.css';

// Types
interface DownloadClientProps {
    id: number;
    title: string;
}

// IMPLEMENTATIONS

export default function DownloadClient({ id, title }: DownloadClientProps) {
    const [deleteDownloadClient] = useDeleteDownloadClientMutation();

    const [isEditDownloadClientModalOpen, setIsEditDownloadClientModalOpen] =
        useState(false);

    const [
        isDeleteDownloadClientModalOpen,
        setIsDeleteDownloadClientModalOpen,
    ] = useState(false);

    const handleEditDownloadClientPress = useCallback(() => {
        setIsEditDownloadClientModalOpen(true);
    }, []);

    const handleEditDownloadClientModalClose = useCallback(() => {
        setIsEditDownloadClientModalOpen(false);
    }, []);

    const handleDeleteDownloadClientPress = useCallback(() => {
        setIsEditDownloadClientModalOpen(false);
        setIsDeleteDownloadClientModalOpen(true);
    }, []);

    const handleDeleteDownloadClientModalClose = useCallback(() => {
        setIsDeleteDownloadClientModalOpen(false);
    }, []);

    const handleConfirmDeleteDownloadClient = useCallback(() => {
        deleteDownloadClient({ id });
    }, [deleteDownloadClient, id]);

    return (
        <Card
            className={styles.downloadClient}
            overlayContent={true}
            onPress={handleEditDownloadClientPress}
        >
            <div className={styles.name}>{title}</div>

            <EditDownloadClientModal
                id={id}
                isOpen={isEditDownloadClientModalOpen}
                onModalClose={handleEditDownloadClientModalClose}
                onDeleteDownloadClientPress={handleDeleteDownloadClientPress}
            />

            <ConfirmModal
                isOpen={isDeleteDownloadClientModalOpen}
                kind={kinds.DANGER}
                title={translate('DeleteDownloadClient')}
                message={translate('DeleteDownloadClientMessageText', {
                    name: title,
                })}
                confirmLabel={translate('Delete')}
                onConfirm={handleConfirmDeleteDownloadClient}
                onCancel={handleDeleteDownloadClientModalClose}
            />
        </Card>
    );
}
