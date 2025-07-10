import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
import { useSelect } from 'App/SelectContext';
// import { type AppState } from 'App/State/AppState';
// import { RENAME_VOLUMES } from 'Commands/commandNames';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { kinds } from 'Helpers/Props';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
// import { saveVolumesEditor, updateVolumesMonitor } from 'Store/Actions/volumesActions';
// import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import DeleteVolumesModal from './Delete/DeleteVolumesModal';
import EditVolumesModal from './Edit/EditVolumesModal';
import OrganizeVolumesModal from './Organize/OrganizeVolumesModal';
import ChangeMonitoringModal from './SeasonPass/ChangeMonitoringModal';
import TagsModal from './Tags/TagsModal';
import styles from './VolumesIndexSelectFooter.module.css';

interface SavePayload {
    monitored?: boolean;
    qualityProfileId?: number;
    volumesType?: string;
    seasonFolder?: boolean;
    rootFolderPath?: string;
    moveFiles?: boolean;
}

/*
const volumesEditorSelector = createSelector(
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

function VolumesIndexSelectFooter() {
    // const { isSaving, isDeleting, deleteError } = useSelector(volumesEditorSelector);

    // const isOrganizingVolumes = useSelector(createCommandExecutingSelector(RENAME_VOLUMES));

    const isSaving = false;
    const isDeleting = false;
    const deleteError = undefined;
    const isOrganizingVolumes = false;

    const dispatch = useDispatch();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSavingVolumes, setIsSavingVolumes] = useState(false);
    const [isSavingTags, setIsSavingTags] = useState(false);
    const [isSavingMonitoring, setIsSavingMonitoring] = useState(false);
    const previousIsDeleting = usePrevious(isDeleting);

    const [selectState, selectDispatch] = useSelect();
    const { selectedState } = selectState;

    const volumesIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const selectedCount = volumesIds.length;

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
            setIsSavingVolumes(true);
            setIsEditModalOpen(false);

            /*
            dispatch(
                saveVolumesEditor({
                    ...payload,
                    volumesIds,
                }),
            );*/
        },
        [volumesIds, dispatch],
    );

    const onOrganizePress = useCallback(() => {
        setIsOrganizeModalOpen(true);
    }, [setIsOrganizeModalOpen]);

    const onOrganizeModalClose = useCallback(() => {
        setIsOrganizeModalOpen(false);
    }, [setIsOrganizeModalOpen]);

    const onTagsPress = useCallback(() => {
        setIsTagsModalOpen(true);
    }, [setIsTagsModalOpen]);

    const onTagsModalClose = useCallback(() => {
        setIsTagsModalOpen(false);
    }, [setIsTagsModalOpen]);

    const onApplyTagsPress = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (tags: number[], applyTags: string) => {
            setIsSavingTags(true);
            setIsTagsModalOpen(false);

            /*
            dispatch(
                saveVolumesEditor({
                    volumesIds,
                    tags,
                    applyTags,
                }),
            );*/
        },
        [volumesIds, dispatch],
    );

    const onMonitoringPress = useCallback(() => {
        setIsMonitoringModalOpen(true);
    }, [setIsMonitoringModalOpen]);

    const onMonitoringClose = useCallback(() => {
        setIsMonitoringModalOpen(false);
    }, [setIsMonitoringModalOpen]);

    const onMonitoringSavePress = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (monitor: string) => {
            setIsSavingMonitoring(true);
            setIsMonitoringModalOpen(false);

            /*
            dispatch(
                updateVolumesMonitor({
                    volumesIds,
                    monitor,
                }),
            );*/
        },
        [volumesIds, dispatch],
    );

    const onDeletePress = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, [setIsDeleteModalOpen]);

    const onDeleteModalClose = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    useEffect(() => {
        if (!isSaving) {
            setIsSavingVolumes(false);
            setIsSavingTags(false);
            setIsSavingMonitoring(false);
        }
    }, [isSaving]);

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
                        isSpinning={isSaving && isSavingVolumes}
                        isDisabled={!anySelected || isOrganizingVolumes}
                        onPress={onEditPress}
                    >
                        {translate('Edit')}
                    </SpinnerButton>

                    <SpinnerButton
                        kind={kinds.WARNING}
                        isSpinning={isOrganizingVolumes}
                        isDisabled={!anySelected || isOrganizingVolumes}
                        onPress={onOrganizePress}
                    >
                        {translate('RenameFiles')}
                    </SpinnerButton>

                    <SpinnerButton
                        isSpinning={isSaving && isSavingTags}
                        isDisabled={!anySelected || isOrganizingVolumes}
                        onPress={onTagsPress}
                    >
                        {translate('SetTags')}
                    </SpinnerButton>

                    <SpinnerButton
                        isSpinning={isSaving && isSavingMonitoring}
                        isDisabled={!anySelected || isOrganizingVolumes}
                        onPress={onMonitoringPress}
                    >
                        {translate('UpdateMonitoring')}
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
                {translate('CountVolumesSelected', { count: selectedCount })}
            </div>

            <EditVolumesModal
                isOpen={isEditModalOpen}
                volumesIds={volumesIds}
                onSavePress={onSavePress}
                onModalClose={onEditModalClose}
            />

            <TagsModal
                isOpen={isTagsModalOpen}
                volumesIds={volumesIds}
                onApplyTagsPress={onApplyTagsPress}
                onModalClose={onTagsModalClose}
            />

            <ChangeMonitoringModal
                isOpen={isMonitoringModalOpen}
                volumesIds={volumesIds}
                onSavePress={onMonitoringSavePress}
                onModalClose={onMonitoringClose}
            />

            <OrganizeVolumesModal
                isOpen={isOrganizeModalOpen}
                volumesIds={volumesIds}
                onModalClose={onOrganizeModalClose}
            />

            <DeleteVolumesModal
                isOpen={isDeleteModalOpen}
                volumesIds={volumesIds}
                onModalClose={onDeleteModalClose}
            />
        </PageContentFooter>
    );
}

export default VolumesIndexSelectFooter;
