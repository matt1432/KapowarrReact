// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
// import { saveVolumeEditor, updateVolumeMonitor } from 'Store/Actions/volumeActions';
// import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';

// Misc
import { useSelect } from 'App/SelectContext';
import { kinds } from 'Helpers/Props';

import usePrevious from 'Helpers/Hooks/usePrevious';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';

// Specific Components
import DeleteVolumeModal from './Delete/DeleteVolumeModal';
import EditVolumeModal from './Edit/EditVolumeModal';
import OrganizeVolumeModal from './Organize/OrganizeVolumeModal';

// CSS
import styles from './VolumeIndexSelectFooter.module.css';

// Types
interface SavePayload {
    monitored?: boolean;
    qualityProfileId?: number;
    specialVersion?: string;
    rootFolderPath?: string;
    moveFiles?: boolean;
}

// IMPLEMENTATIONS

/*
const volumeEditorSelector = createSelector(
    (state: AppState) => state.volumes,
    (volumes) => {
        const { isSaving, isDeleting, deleteError } = volumes;

        return {
            isSaving,
            isDeleting,
            deleteError,
        };
    },
);
*/

function VolumeIndexSelectFooter() {
    // const { isSaving, isDeleting, deleteError } = useSelector(volumeEditorSelector);

    // const isOrganizingVolume = useSelector(createCommandExecutingSelector(RENAME_VOLUMES));

    const isSaving = false;
    const isDeleting = false;
    const deleteError = undefined;
    const isOrganizingVolume = false;

    const dispatch = useDispatch();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSavingVolume, setIsSavingVolume] = useState(false);
    const previousIsDeleting = usePrevious(isDeleting);

    const [selectState, selectDispatch] = useSelect();
    const { selectedState } = selectState;

    const volumeIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const selectedCount = volumeIds.length;

    const onEditPress = useCallback(() => {
        setIsEditModalOpen(true);
    }, [setIsEditModalOpen]);

    const onEditModalClose = useCallback(() => {
        setIsEditModalOpen(false);
    }, [setIsEditModalOpen]);

    const onSavePress = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: SavePayload) => {
            setIsSavingVolume(true);
            setIsEditModalOpen(false);

            /*
            dispatch(
                saveVolumeEditor({
                    ...payload,
                    volumeIds,
                }),
            );*/
        },
        [volumeIds, dispatch],
    );

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
        if (previousIsDeleting && !isDeleting && !deleteError) {
            selectDispatch({ type: 'unselectAll' });
        }
    }, [previousIsDeleting, isDeleting, deleteError, selectDispatch]);

    useEffect(() => {
        // dispatch(fetchRootFolders());
    }, [dispatch]);

    const anySelected = selectedCount > 0;

    return (
        <PageContentFooter className={styles.footer}>
            <div className={styles.buttons}>
                <div className={styles.actionButtons}>
                    <SpinnerButton
                        isSpinning={isSaving && isSavingVolume}
                        isDisabled={!anySelected || isOrganizingVolume}
                        onPress={onEditPress}
                    >
                        {translate('Edit')}
                    </SpinnerButton>

                    <SpinnerButton
                        kind={kinds.WARNING}
                        isSpinning={isOrganizingVolume}
                        isDisabled={!anySelected || isOrganizingVolume}
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
