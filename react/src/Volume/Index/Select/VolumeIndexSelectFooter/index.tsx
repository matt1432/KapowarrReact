// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';
import { useGetVolumesQuery } from 'Store/Api/Volumes';
import { useMassEditMutation } from 'Store/Api/Command';

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

export default function VolumeIndexSelectFooter() {
    const { massEditorStatus } = useRootSelector((state) => state.socketEvents);

    const { refetch } = useGetVolumesQuery();

    const isSaving = useMemo(
        () =>
            massEditorStatus.root_folder.isRunning ||
            massEditorStatus.monitor.isRunning ||
            massEditorStatus.unmonitor.isRunning,
        [
            massEditorStatus.root_folder.isRunning,
            massEditorStatus.monitor.isRunning,
            massEditorStatus.unmonitor.isRunning,
        ],
    );
    const isDeleting = useMemo(
        () => massEditorStatus.delete.isRunning,
        [massEditorStatus.delete.isRunning],
    );
    const isOrganizing = useMemo(
        () => massEditorStatus.rename.isRunning,
        [massEditorStatus.rename.isRunning],
    );
    const isConverting = useMemo(
        () => massEditorStatus.convert.isRunning,
        [massEditorStatus.convert.isRunning],
    );
    const isRemovingAds = useMemo(
        () => massEditorStatus.remove_ads.isRunning,
        [massEditorStatus.remove_ads.isRunning],
    );

    // Refresh volumes once an action is finished
    useSocketEvents({
        massEditorStatus: ({ currentItem, totalItems }) => {
            if (currentItem === totalItems) {
                refetch();
            }
        },
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const wasDeleting = usePrevious(isDeleting);

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

    const [runMassEditAction] = useMassEditMutation();

    const onConvertPress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.CONVERT,
            volumeIds,
        });
    }, [runMassEditAction, volumeIds]);

    const onRemoveAdsPress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.REMOVE_ADS,
            volumeIds,
        });
    }, [runMassEditAction, volumeIds]);

    useEffect(() => {
        if (wasDeleting && !isDeleting) {
            selectDispatch({ type: 'unselectAll' });
        }
    }, [wasDeleting, isDeleting, selectDispatch]);

    const { refetch: fetchRootFolders } = useGetRootFoldersQuery();

    useEffect(() => {
        fetchRootFolders();
    }, [fetchRootFolders]);

    const anySelected = selectedCount > 0;

    return (
        <PageContentFooter className={styles.footer}>
            <div className={styles.buttons}>
                <div className={styles.actionButtons}>
                    <SpinnerButton
                        isSpinning={isSaving}
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

                    <SpinnerButton
                        isSpinning={isConverting}
                        isDisabled={!anySelected || isConverting}
                        onPress={onConvertPress}
                    >
                        {translate('ConvertFiles')}
                    </SpinnerButton>

                    <SpinnerButton
                        isSpinning={isRemovingAds}
                        isDisabled={!anySelected || isRemovingAds}
                        onPress={onRemoveAdsPress}
                    >
                        {translate('RemoveAds')}
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
