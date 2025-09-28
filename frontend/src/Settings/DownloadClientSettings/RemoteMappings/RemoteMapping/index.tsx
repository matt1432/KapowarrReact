// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteRemoteMappingMutation } from 'Store/Api/RootFolders';

// Misc
import { icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

import classNames from 'classnames';

// Hooks

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';

// Specific Components
import EditRemoteMappingModal from '../EditRemoteMappingModal';

// CSS
import styles from './index.module.css';

// Types
interface RemoteMappingProps {
    id: number;
    host: string;
    remotePath: string;
    localPath: string;
}

// IMPLEMENTATIONS

export default function RemoteMapping({
    id,
    host,
    remotePath,
    localPath,
}: RemoteMappingProps) {
    const [isEditRemoteMappingModalOpen, setIsEditRemoteMappingModalOpen] =
        useState(false);

    const [isDeleteRemoteMappingModalOpen, setIsDeleteRemoteMappingModalOpen] =
        useState(false);

    const handleEditRemoteMappingPress = useCallback(() => {
        setIsEditRemoteMappingModalOpen(true);
    }, []);

    const handleEditRemoteMappingModalClose = useCallback(() => {
        setIsEditRemoteMappingModalOpen(false);
    }, []);

    const handleDeleteRemoteMappingPress = useCallback(() => {
        setIsEditRemoteMappingModalOpen(false);
        setIsDeleteRemoteMappingModalOpen(true);
    }, []);

    const handleDeleteRemoteMappingModalClose = useCallback(() => {
        setIsDeleteRemoteMappingModalOpen(false);
    }, []);

    const [deleteRemoteMapping] = useDeleteRemoteMappingMutation();

    const handleConfirmDeleteRemoteMapping = useCallback(() => {
        deleteRemoteMapping({ id });
    }, [deleteRemoteMapping, id]);

    return (
        <div className={classNames(styles.remotePathMapping)}>
            <div className={styles.host}>{host}</div>
            <div className={styles.path}>{remotePath}</div>
            <div className={styles.path}>{localPath}</div>

            <div className={styles.actions}>
                <Link onPress={handleEditRemoteMappingPress}>
                    <Icon name={icons.EDIT} />
                </Link>
            </div>

            <EditRemoteMappingModal
                id={id}
                isOpen={isEditRemoteMappingModalOpen}
                onModalClose={handleEditRemoteMappingModalClose}
                onDeleteRemoteMappingPress={handleDeleteRemoteMappingPress}
            />

            <ConfirmModal
                isOpen={isDeleteRemoteMappingModalOpen}
                kind={kinds.DANGER}
                title={translate('DeleteRemoteMapping')}
                message={translate('DeleteRemoteMappingMessageText')}
                confirmLabel={translate('Delete')}
                onConfirm={handleConfirmDeleteRemoteMapping}
                onCancel={handleDeleteRemoteMappingModalClose}
            />
        </div>
    );
}
