// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteIndexerMutation } from 'Store/Api/Indexers';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Card from 'Components/Card';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import Label from 'Components/Label';

// Specific Components
import EditIndexerModal from '../EditIndexer';

// CSS
import styles from './index.module.css';

// Types
interface IndexerProps {
    id: number;
    title: string;
    enabled: boolean;
    onIndexersChange: () => void;
}

// IMPLEMENTATIONS

export default function Indexer({
    id,
    title,
    enabled,
    onIndexersChange,
}: IndexerProps) {
    const [deleteIndexer] = useDeleteIndexerMutation();

    const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);

    const [isDeleteIndexerModalOpen, setIsDeleteIndexerModalOpen] =
        useState(false);

    const handleEditIndexerPress = useCallback(() => {
        setIsEditIndexerModalOpen(true);
    }, []);

    const handleEditIndexerModalClose = useCallback(() => {
        setIsEditIndexerModalOpen(false);
    }, []);

    const handleDeleteIndexerPress = useCallback(() => {
        setIsEditIndexerModalOpen(false);
        setIsDeleteIndexerModalOpen(true);
    }, []);

    const handleDeleteIndexerModalClose = useCallback(() => {
        setIsDeleteIndexerModalOpen(false);
    }, []);

    const handleConfirmDeleteIndexer = useCallback(() => {
        deleteIndexer({ id }).finally(() => {
            setIsDeleteIndexerModalOpen(false);
            onIndexersChange();
        });
    }, [deleteIndexer, id, onIndexersChange]);

    return (
        <Card
            className={styles.indexer}
            overlayContent={true}
            onPress={handleEditIndexerPress}
        >
            <div className={styles.name}>{title}</div>

            <div className={styles.enabled}>
                {enabled ? (
                    <Label kind={kinds.SUCCESS}>{translate('Enabled')}</Label>
                ) : (
                    <Label kind={kinds.DISABLED} outline={true}>
                        {translate('Disabled')}
                    </Label>
                )}
            </div>

            <EditIndexerModal
                id={id}
                isOpen={isEditIndexerModalOpen}
                onModalClose={handleEditIndexerModalClose}
                onDeleteIndexerPress={handleDeleteIndexerPress}
                onIndexersChange={onIndexersChange}
            />

            <ConfirmModal
                isOpen={isDeleteIndexerModalOpen}
                kind={kinds.DANGER}
                title={translate('DeleteIndexer')}
                message={translate('DeleteIndexerMessageText', {
                    name: title,
                })}
                confirmLabel={translate('Delete')}
                onConfirm={handleConfirmDeleteIndexer}
                onCancel={handleDeleteIndexerModalClose}
            />
        </Card>
    );
}
