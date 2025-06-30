import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import { RENAME_COMICS } from 'Commands/commandNames';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { kinds } from 'Helpers/Props';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
// import { saveComicsEditor, updateComicsMonitor } from 'Store/Actions/comicsActions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import DeleteComicsModal from './Delete/DeleteComicsModal';
import EditComicsModal from './Edit/EditComicsModal';
import OrganizeComicsModal from './Organize/OrganizeComicsModal';
import ChangeMonitoringModal from './SeasonPass/ChangeMonitoringModal';
import TagsModal from './Tags/TagsModal';
import styles from './ComicsIndexSelectFooter.module.css';

interface SavePayload {
    monitored?: boolean;
    qualityProfileId?: number;
    comicsType?: string;
    seasonFolder?: boolean;
    rootFolderPath?: string;
    moveFiles?: boolean;
}

const comicsEditorSelector = createSelector(
    (state: AppState) => state.comics,
    (comics) => {
        const { isSaving, isDeleting, deleteError } = comics;

        return {
            isSaving,
            isDeleting,
            deleteError,
        };
    },
);

function ComicsIndexSelectFooter() {
    const { isSaving, isDeleting, deleteError } = useSelector(comicsEditorSelector);

    const isOrganizingComics = useSelector(createCommandExecutingSelector(RENAME_COMICS));

    const dispatch = useDispatch();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSavingComics, setIsSavingComics] = useState(false);
    const [isSavingTags, setIsSavingTags] = useState(false);
    const [isSavingMonitoring, setIsSavingMonitoring] = useState(false);
    const previousIsDeleting = usePrevious(isDeleting);

    const [selectState, selectDispatch] = useSelect();
    const { selectedState } = selectState;

    const comicsIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const selectedCount = comicsIds.length;

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
            setIsSavingComics(true);
            setIsEditModalOpen(false);

            /*
            dispatch(
                saveComicsEditor({
                    ...payload,
                    comicsIds,
                }),
            );*/
        },
        [comicsIds, dispatch],
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
                saveComicsEditor({
                    comicsIds,
                    tags,
                    applyTags,
                }),
            );*/
        },
        [comicsIds, dispatch],
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
                updateComicsMonitor({
                    comicsIds,
                    monitor,
                }),
            );*/
        },
        [comicsIds, dispatch],
    );

    const onDeletePress = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, [setIsDeleteModalOpen]);

    const onDeleteModalClose = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    useEffect(() => {
        if (!isSaving) {
            setIsSavingComics(false);
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
                        isSpinning={isSaving && isSavingComics}
                        isDisabled={!anySelected || isOrganizingComics}
                        onPress={onEditPress}
                    >
                        {translate('Edit')}
                    </SpinnerButton>

                    <SpinnerButton
                        kind={kinds.WARNING}
                        isSpinning={isOrganizingComics}
                        isDisabled={!anySelected || isOrganizingComics}
                        onPress={onOrganizePress}
                    >
                        {translate('RenameFiles')}
                    </SpinnerButton>

                    <SpinnerButton
                        isSpinning={isSaving && isSavingTags}
                        isDisabled={!anySelected || isOrganizingComics}
                        onPress={onTagsPress}
                    >
                        {translate('SetTags')}
                    </SpinnerButton>

                    <SpinnerButton
                        isSpinning={isSaving && isSavingMonitoring}
                        isDisabled={!anySelected || isOrganizingComics}
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
                {translate('CountComicsSelected', { count: selectedCount })}
            </div>

            <EditComicsModal
                isOpen={isEditModalOpen}
                comicsIds={comicsIds}
                onSavePress={onSavePress}
                onModalClose={onEditModalClose}
            />

            <TagsModal
                isOpen={isTagsModalOpen}
                comicsIds={comicsIds}
                onApplyTagsPress={onApplyTagsPress}
                onModalClose={onTagsModalClose}
            />

            <ChangeMonitoringModal
                isOpen={isMonitoringModalOpen}
                comicsIds={comicsIds}
                onSavePress={onMonitoringSavePress}
                onModalClose={onMonitoringClose}
            />

            <OrganizeComicsModal
                isOpen={isOrganizeModalOpen}
                comicsIds={comicsIds}
                onModalClose={onOrganizeModalClose}
            />

            <DeleteComicsModal
                isOpen={isDeleteModalOpen}
                comicsIds={comicsIds}
                onModalClose={onDeleteModalClose}
            />
        </PageContentFooter>
    );
}

export default ComicsIndexSelectFooter;
