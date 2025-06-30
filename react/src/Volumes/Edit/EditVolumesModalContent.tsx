import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VolumesMonitorNewItemsOptionsPopoverContent from 'AddVolumes/VolumesMonitorNewItemsOptionsPopoverContent';
import { type AppState } from 'App/State/AppState';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons, inputTypes, kinds, sizes, tooltipPositions } from 'Helpers/Props';
import MoveVolumesModal from 'Volumes/MoveVolumes/MoveVolumesModal';
import useVolumes from 'Volumes/useVolumes';
// import { saveVolumes, setVolumesValue } from 'Store/Actions/volumesActions';
import selectSettings from 'Store/Selectors/selectSettings';
import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import RootFolderModal from './RootFolder/RootFolderModal';
import { type RootFolderUpdated } from './RootFolder/RootFolderModalContent';
import styles from './EditVolumesModalContent.module.css';

export interface EditVolumesModalContentProps {
    volumesId: number;
    onModalClose: () => void;
    onDeleteVolumesPress: () => void;
}
function EditVolumesModalContent({
    volumesId,
    onModalClose,
    onDeleteVolumesPress,
}: EditVolumesModalContentProps) {
    const dispatch = useDispatch();
    const {
        title,
        monitored,
        monitorNewItems,
        seasonFolder,
        qualityProfileId,
        volumesType,
        path,
        tags,
        rootFolderPath: initialRootFolderPath,
    } = useVolumes(volumesId)!;

    const { isSaving, saveError, pendingChanges } = useSelector((state: AppState) => state.volumes);

    const wasSaving = usePrevious(isSaving);

    const [isRootFolderModalOpen, setIsRootFolderModalOpen] = useState(false);

    const [rootFolderPath, setRootFolderPath] = useState(initialRootFolderPath);

    const isPathChanging = pendingChanges.path && path !== pendingChanges.path;

    const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false);

    const { settings, ...otherSettings } = useMemo(() => {
        return selectSettings(
            {
                monitored,
                monitorNewItems,
                seasonFolder,
                qualityProfileId,
                volumesType,
                path,
                tags,
            },
            pendingChanges,
            saveError,
        );
    }, [
        monitored,
        monitorNewItems,
        seasonFolder,
        qualityProfileId,
        volumesType,
        path,
        tags,
        pendingChanges,
        saveError,
    ]);

    const handleInputChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        ({ name, value }: InputChanged) => {
            // // @ts-expect-error actions aren't typed
            // dispatch(setVolumesValue({ name, value }));
        },
        [dispatch],
    );

    const handleRootFolderPress = useCallback(() => {
        setIsRootFolderModalOpen(true);
    }, []);

    const handleRootFolderModalClose = useCallback(() => {
        setIsRootFolderModalOpen(false);
    }, []);

    const handleRootFolderChange = useCallback(
        ({ path: newPath, rootFolderPath: newRootFolderPath }: RootFolderUpdated) => {
            setIsRootFolderModalOpen(false);
            setRootFolderPath(newRootFolderPath);
            handleInputChange({ name: 'path', value: newPath });
        },
        [handleInputChange],
    );

    const handleCancelPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
    }, []);

    const handleSavePress = useCallback(() => {
        if (isPathChanging && !isConfirmMoveModalOpen) {
            setIsConfirmMoveModalOpen(true);
        }
        else {
            setIsConfirmMoveModalOpen(false);

            /*
            dispatch(
                saveVolumes({
                    id: volumesId,
                    moveFiles: false,
                }),
            );*/
        }
    }, [volumesId, isPathChanging, isConfirmMoveModalOpen, dispatch]);

    const handleMoveVolumesPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);

        /*
        dispatch(
            saveVolumes({
                id: volumesId,
                moveFiles: true,
            }),
        );*/
    }, [volumesId, dispatch]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('EditVolumesModalHeader', { title })}</ModalHeader>

            <ModalBody>
                <Form {...otherSettings}>
                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Monitored')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="monitored"
                            helpText={translate('MonitoredIssuesHelpText')}
                            {...settings.monitored}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>
                            {translate('MonitorNewSeasons')}
                            <Popover
                                anchor={<Icon className={styles.labelIcon} name={icons.INFO} />}
                                title={translate('MonitorNewSeasons')}
                                body={<VolumesMonitorNewItemsOptionsPopoverContent />}
                                position={tooltipPositions.RIGHT}
                            />
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.MONITOR_NEW_ITEMS_SELECT}
                            name="monitorNewItems"
                            helpText={translate('MonitorNewSeasonsHelpText')}
                            {...settings.monitorNewItems}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('UseSeasonFolder')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="seasonFolder"
                            helpText={translate('UseSeasonFolderHelpText')}
                            {...settings.seasonFolder}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('QualityProfile')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.QUALITY_PROFILE_SELECT}
                            name="qualityProfileId"
                            {...settings.qualityProfileId}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('VolumesType')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.VOLUMES_TYPE_SELECT}
                            name="volumesType"
                            {...settings.volumesType}
                            helpText={translate('VolumesTypesHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Path')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.PATH}
                            name="path"
                            {...settings.path}
                            buttons={[
                                <FormInputButton
                                    key="fileBrowser"
                                    kind={kinds.DEFAULT_KIND}
                                    title={translate('RootFolder')}
                                    onPress={handleRootFolderPress}
                                >
                                    <Icon name={icons.ROOT_FOLDER} />
                                </FormInputButton>,
                            ]}
                            includeFiles={false}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Tags')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TAG}
                            name="tags"
                            {...settings.tags}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button
                    className={styles.deleteButton}
                    kind={kinds.DANGER}
                    onPress={onDeleteVolumesPress}
                >
                    {translate('Delete')}
                </Button>

                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <SpinnerErrorButton
                    error={saveError}
                    isSpinning={isSaving}
                    onPress={handleSavePress}
                >
                    {translate('Save')}
                </SpinnerErrorButton>
            </ModalFooter>

            <RootFolderModal
                isOpen={isRootFolderModalOpen}
                volumesId={volumesId}
                rootFolderPath={rootFolderPath}
                onSavePress={handleRootFolderChange}
                onModalClose={handleRootFolderModalClose}
            />

            <MoveVolumesModal
                originalPath={path}
                destinationPath={pendingChanges.path}
                isOpen={isConfirmMoveModalOpen}
                onModalClose={handleCancelPress}
                onSavePress={handleSavePress}
                onMoveVolumesPress={handleMoveVolumesPress}
            />
        </ModalContent>
    );
}

export default EditVolumesModalContent;
