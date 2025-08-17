// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';
import { useGetVolumesQuery } from 'Store/Api/Volumes';
import { useIndexVolumes } from 'Volume/Index';

// Misc
import { useSelect } from 'App/SelectContext';

import { kinds, massEditActions } from 'Helpers/Props';

import useSocketEvents from 'Helpers/Hooks/useSocketEvents';
import usePrevious from 'Helpers/Hooks/usePrevious';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';

// Specific Components
import DeleteVolumeModal from '../Delete/DeleteVolumeModal';
import EditVolumeModal from '../Edit/EditVolumeModal';
import OrganizeVolumeModal from '../Organize/OrganizeVolumeModal';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

function VolumeIndexSelectFooter() {
    const { refetch } = useGetVolumesQuery(undefined);
    const { refetch: refetchIndex } = useIndexVolumes();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOrganizing, setIsOrganizing] = useState(false);

    useSocketEvents({
        mass_editor_status: ({ identifier, current_item, total_items }) => {
            const value = current_item !== total_items;

            if (!value) {
                // Refresh volumes once an action is finished
                refetch();
                refetchIndex();
            }

            switch (identifier) {
                // FIXME: not sure this is the right one
                case massEditActions.UPDATE: {
                    setIsSaving(value);
                    break;
                }
                case massEditActions.DELETE: {
                    setIsDeleting(value);
                    break;
                }
                case massEditActions.RENAME: {
                    setIsOrganizing(value);
                    break;
                }
            }
        },
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSavingVolume, setIsSavingVolume] = useState(false);

    const previousIsDeleting = usePrevious(isDeleting);

    const [{ selectedState }, selectDispatch] = useSelect();

    const volumeIds = useMemo(() => getSelectedIds(selectedState), [selectedState]);

    const selectedCount = volumeIds.length;

    const onEditPress = useCallback(() => {
        setIsEditModalOpen(true);
    }, [setIsEditModalOpen]);

    const onEditModalClose = useCallback(() => {
        setIsEditModalOpen(false);
    }, [setIsEditModalOpen]);

    const onSavePress = useCallback(() => {
        setIsSavingVolume(true);
        setIsEditModalOpen(false);
    }, []);

    const onOrganizePress = useCallback(() => {
        setIsOrganizeModalOpen(true);
    }, [setIsOrganizeModalOpen]);

    const onOrganizeModalClose = useCallback(() => {
        setIsOrganizeModalOpen(false);
    }, [setIsOrganizeModalOpen]);

    const onDeletePress = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, [setIsDeleteModalOpen]);

    const onDeleteModalClose = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    useEffect(() => {
        if (previousIsDeleting && !isDeleting) {
            selectDispatch({ type: 'unselectAll' });
        }
    }, [previousIsDeleting, isDeleting, selectDispatch]);

    const { refetch: fetchRootFolders } = useGetRootFoldersQuery(undefined);

    useEffect(() => {
        fetchRootFolders();
    }, [fetchRootFolders]);

    const anySelected = selectedCount > 0;

    return (
        <PageContentFooter className={styles.footer}>
            <div className={styles.buttons}>
                <div className={styles.actionButtons}>
                    <SpinnerButton
                        isSpinning={isSaving && isSavingVolume}
                        isDisabled={!anySelected || isOrganizing}
                        onPress={onEditPress}
                    >
                        {translate('Edit')}
                    </SpinnerButton>

                    <SpinnerButton
                        kind={kinds.WARNING}
                        isSpinning={isOrganizing}
                        isDisabled={!anySelected || isOrganizing}
                        onPress={onOrganizePress}
                    >
                        {translate('RenameFiles')}
                    </SpinnerButton>
                </div>

                <div className={styles.deleteButtons}>
                    <SpinnerButton
                        kind={kinds.DANGER}
                        isSpinning={isDeleting}
                        isDisabled={!anySelected || isDeleting}
                        onPress={onDeletePress}
                    >
                        {translate('Delete')}
                    </SpinnerButton>
                </div>
            </div>

            <div className={styles.selected}>
                {translate('CountVolumeSelected', { count: selectedCount })}
            </div>

            <EditVolumeModal
                isOpen={isEditModalOpen}
                volumeIds={volumeIds}
                onSavePress={onSavePress}
                onModalClose={onEditModalClose}
            />

            <OrganizeVolumeModal
                isOpen={isOrganizeModalOpen}
                volumeIds={volumeIds}
                onModalClose={onOrganizeModalClose}
            />

            <DeleteVolumeModal
                isOpen={isDeleteModalOpen}
                volumeIds={volumeIds}
                onModalClose={onDeleteModalClose}
            />
        </PageContentFooter>
    );
}

export default VolumeIndexSelectFooter;
