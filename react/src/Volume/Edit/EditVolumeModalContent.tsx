/*import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VolumeMonitorNewItemsOptionsPopoverContent from 'AddVolume/VolumeMonitorNewItemsOptionsPopoverContent';
// import type { AppState } from 'App/State/AppState';
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
import MoveVolumeModal from 'Volume/MoveVolume/MoveVolumeModal';
// import useVolume from 'Volume/useVolume';
// import { saveVolume, setVolumeValue } from 'Store/Actions/volumeActions';
// import selectSettings from 'Store/Selectors/selectSettings';
import type { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import RootFolderModal from './RootFolder/RootFolderModal';
import type { RootFolderUpdated } from './RootFolder/RootFolderModalContent';
import styles from './EditVolumeModalContent.module.css';*/

export interface EditVolumeModalContentProps {
    volumeId: number;
    onModalClose: () => void;
    onDeleteVolumePress: () => void;
}
function EditVolumeModalContent(
    // eslint-disable-next-line
    {
        // volumeId,
        // onModalClose,
        // onDeleteVolumePress,
    }: EditVolumeModalContentProps,
) {
    /*
    const dispatch = useDispatch();
    const {
        title,
        monitored,
        monitorNewItems,
        qualityProfileId,
        specialVersion,
        path,
        tags,
        rootFolderPath: initialRootFolderPath,
    } = useVolume(volumeId)!;

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
                qualityProfileId,
                specialVersion,
                path,
                tags,
            },
            pendingChanges,
            saveError,
        );
    }, [
        monitored,
        monitorNewItems,
        qualityProfileId,
        specialVersion,
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
            // dispatch(setVolumeValue({ name, value }));
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

            dispatch(
                saveVolume({
                    id: volumeId,
                    moveFiles: false,
                }),
            );
        }
    }, [volumeId, isPathChanging, isConfirmMoveModalOpen, dispatch]);

    const handleMoveVolumePress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);

        dispatch(
            saveVolume({
                id: volumeId,
                moveFiles: true,
            }),
        );
    }, [volumeId, dispatch]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('EditVolumeModalHeader', { title })}</ModalHeader>

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
                        <FormLabel>{translate('QualityProfile')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.QUALITY_PROFILE_SELECT}
                            name="qualityProfileId"
                            {...settings.qualityProfileId}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('SpecialVersion')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.VOLUME_TYPE_SELECT}
                            name="specialVersion"
                            {...settings.specialVersion}
                            helpText={translate('SpecialVersionsHelpText')}
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
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button
                    className={styles.deleteButton}
                    kind={kinds.DANGER}
                    onPress={onDeleteVolumePress}
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
                volumeId={volumeId}
                rootFolderPath={rootFolderPath}
                onSavePress={handleRootFolderChange}
                onModalClose={handleRootFolderModalClose}
            />

            <MoveVolumeModal
                originalPath={path}
                destinationPath={pendingChanges.path}
                isOpen={isConfirmMoveModalOpen}
                onModalClose={handleCancelPress}
                onSavePress={handleSavePress}
                onMoveVolumePress={handleMoveVolumePress}
            />
        </ModalContent>
    );*/
    return null;
}

export default EditVolumeModalContent;
