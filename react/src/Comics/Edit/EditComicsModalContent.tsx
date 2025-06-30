import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ComicsMonitorNewItemsOptionsPopoverContent from 'AddComics/ComicsMonitorNewItemsOptionsPopoverContent';
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
import MoveComicsModal from 'Comics/MoveComics/MoveComicsModal';
import useComics from 'Comics/useComics';
// import { saveComics, setComicsValue } from 'Store/Actions/comicsActions';
import selectSettings from 'Store/Selectors/selectSettings';
import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import RootFolderModal from './RootFolder/RootFolderModal';
import { type RootFolderUpdated } from './RootFolder/RootFolderModalContent';
import styles from './EditComicsModalContent.module.css';

export interface EditComicsModalContentProps {
    comicsId: number;
    onModalClose: () => void;
    onDeleteComicsPress: () => void;
}
function EditComicsModalContent({
    comicsId,
    onModalClose,
    onDeleteComicsPress,
}: EditComicsModalContentProps) {
    const dispatch = useDispatch();
    const {
        title,
        monitored,
        monitorNewItems,
        seasonFolder,
        qualityProfileId,
        comicsType,
        path,
        tags,
        rootFolderPath: initialRootFolderPath,
    } = useComics(comicsId)!;

    const { isSaving, saveError, pendingChanges } = useSelector((state: AppState) => state.comics);

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
                comicsType,
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
        comicsType,
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
            // dispatch(setComicsValue({ name, value }));
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
                saveComics({
                    id: comicsId,
                    moveFiles: false,
                }),
            );*/
        }
    }, [comicsId, isPathChanging, isConfirmMoveModalOpen, dispatch]);

    const handleMoveComicsPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);

        /*
        dispatch(
            saveComics({
                id: comicsId,
                moveFiles: true,
            }),
        );*/
    }, [comicsId, dispatch]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('EditComicsModalHeader', { title })}</ModalHeader>

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
                                body={<ComicsMonitorNewItemsOptionsPopoverContent />}
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
                        <FormLabel>{translate('ComicsType')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.COMICS_TYPE_SELECT}
                            name="comicsType"
                            {...settings.comicsType}
                            helpText={translate('ComicsTypesHelpText')}
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
                    onPress={onDeleteComicsPress}
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
                comicsId={comicsId}
                rootFolderPath={rootFolderPath}
                onSavePress={handleRootFolderChange}
                onModalClose={handleRootFolderModalClose}
            />

            <MoveComicsModal
                originalPath={path}
                destinationPath={pendingChanges.path}
                isOpen={isConfirmMoveModalOpen}
                onModalClose={handleCancelPress}
                onSavePress={handleSavePress}
                onMoveComicsPress={handleMoveComicsPress}
            />
        </ModalContent>
    );
}

export default EditComicsModalContent;
