// TODO:
import { useCallback, useState } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import { kinds } from 'Helpers/Props';
// import { deleteDownloadClient } from 'Store/Actions/settingsActions';
import translate from 'Utilities/String/translate';
import EditDownloadClientModal from '../EditDownloadClient';
import styles from './index.module.css';

interface DownloadClientProps {
    id: number;
    name: string;
    enable: boolean;
    priority: number;
}

export default function DownloadClient({ id, name, enable, priority }: DownloadClientProps) {
    const [isEditDownloadClientModalOpen, setIsEditDownloadClientModalOpen] = useState(false);

    const [isDeleteDownloadClientModalOpen, setIsDeleteDownloadClientModalOpen] = useState(false);

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
        // dispatch(deleteDownloadClient({ id }));
    }, [id]);

    return (
        <Card
            className={styles.downloadClient}
            overlayContent={true}
            onPress={handleEditDownloadClientPress}
        >
            <div className={styles.name}>{name}</div>

            <div className={styles.enabled}>
                {enable ? (
                    <Label kind={kinds.SUCCESS}>{translate('Enabled')}</Label>
                ) : (
                    <Label kind={kinds.DISABLED} outline={true}>
                        {translate('Disabled')}
                    </Label>
                )}

                {priority > 1 ? (
                    <Label kind={kinds.DISABLED} outline={true}>
                        {translate('PrioritySettings', { priority })}
                    </Label>
                ) : null}
            </div>

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
                message={translate('DeleteDownloadClientMessageText', { name })}
                confirmLabel={translate('Delete')}
                onConfirm={handleConfirmDeleteDownloadClient}
                onCancel={handleDeleteDownloadClientModalClose}
            />
        </Card>
    );
}
