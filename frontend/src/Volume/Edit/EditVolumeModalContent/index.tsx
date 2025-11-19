// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';
import {
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
    type UpdateVolumeParams,
} from 'Store/Api/Volumes';

// Misc
import { icons, inputTypes, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
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

// Specific Components
import MoveVolumeModal from 'Volume/MoveVolume/MoveVolumeModal';
import RootFolderModal from '../RootFolder/RootFolderModal';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';
import type { RootFolderUpdated } from '../RootFolder/RootFolderModalContent';
import type { SpecialVersion } from 'Helpers/Props/specialVersions';

export interface EditVolumeModalContentProps {
    volumeId: number;
    onModalClose: () => void;
    onDeleteVolumePress: () => void;
}

// IMPLEMENTATIONS

export default function EditVolumeModalContent({
    volumeId,
    onModalClose,
    onDeleteVolumePress,
}: EditVolumeModalContentProps) {
    const [updateVolume, { isLoading: isSaving, error: saveError }] =
        useUpdateVolumeMutation();

    const { data: rootFolders = [] } = useGetRootFoldersQuery();

    const { data: volume } = useSearchVolumeQuery({ volumeId });
    const {
        title,
        libgenSeriesId: initialLibgenSeriesId,
        marvelId: initialMarvelId,
        monitored: initialMonitored,
        specialVersion: initialSpecialVersion,
        volumeFolder: initialVolumeFolder,
        rootFolder: initialRootFolderPath,
    } = volume!;

    const [isRootFolderModalOpen, setIsRootFolderModalOpen] = useState(false);
    const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false);

    const [rootFolderId, setRootFolderId] = useState(initialRootFolderPath);
    const rootFolderPath = useMemo(
        () => rootFolders.find((f) => f.id === rootFolderId)?.folder ?? '',
        [rootFolderId, rootFolders],
    );

    const [monitored, setMonitored] = useState(initialMonitored);
    const [specialVersion, setSpecialVersion] = useState(
        initialSpecialVersion ?? '',
    );
    const [libgenSeriesId, setLibgenSeriesId] = useState(
        initialLibgenSeriesId ?? '',
    );
    const [marvelId, setMarvelId] = useState(initialMarvelId);
    const [volumeFolder, setVolumeFolder] = useState(initialVolumeFolder);

    const isPathChanging = useMemo(
        () => initialVolumeFolder !== volumeFolder,
        [initialVolumeFolder, volumeFolder],
    );

    const [prevVolume, setPrevVolume] = useState(volume);
    if (volume !== prevVolume) {
        setPrevVolume(volume);

        setLibgenSeriesId(initialLibgenSeriesId ?? '');
        setMarvelId(initialMarvelId);
        setMonitored(initialMonitored);
        setSpecialVersion(initialSpecialVersion ?? '');
        setVolumeFolder(initialVolumeFolder);
        setRootFolderId(initialRootFolderPath);
    }

    const handleInputChange = useCallback(
        <K extends keyof UpdateVolumeParams>({
            name,
            value,
        }: InputChanged<K, UpdateVolumeParams[K]>) => {
            switch (name) {
                case 'monitored':
                    setMonitored(value as boolean);
                    break;
                case 'specialVersion':
                    setSpecialVersion(value as SpecialVersion);
                    break;
                case 'libgenSeriesId':
                    setLibgenSeriesId(value as string);
                    break;
                case 'marvelId':
                    setMarvelId(value as number | null);
                    break;
                case 'volumeFolder':
                    setVolumeFolder(
                        (value as string)
                            .replaceAll(rootFolderPath, '')
                            .replaceAll(rootFolderPath.slice(0, -1), ''),
                    );
                    break;
            }
        },
        [rootFolderPath],
    );

    const handleRootFolderPress = useCallback(() => {
        setIsRootFolderModalOpen(true);
    }, []);

    const handleRootFolderModalClose = useCallback(() => {
        setIsRootFolderModalOpen(false);
    }, []);

    const handleRootFolderChange = useCallback(
        ({ newRootFolderPath }: RootFolderUpdated) => {
            setIsRootFolderModalOpen(false);
            setRootFolderId(
                rootFolders.find((f) => f.folder === newRootFolderPath)!.id,
            );
            handleInputChange({ name: 'volumeFolder', value: volumeFolder });
        },
        [handleInputChange, rootFolders, volumeFolder],
    );

    const handleCancelPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
    }, []);

    const libgenSeriesIdHasError = useMemo(() => {
        if (!libgenSeriesId || libgenSeriesId === '') {
            return false;
        }
        return !libgenSeriesId.split(',').every((id) => /^\d+$/.test(id));
    }, [libgenSeriesId]);

    const saveVolume = useCallback(async () => {
        if (libgenSeriesIdHasError) {
            return;
        }

        const { error: updateError } = await updateVolume({
            volumeId,
            rootFolder: rootFolderId,
            monitored,
            specialVersion: specialVersion === '' ? null : specialVersion,
            specialVersionLocked: true,
            volumeFolder,
            libgenSeriesId,
            marvelId,
        });

        if (!updateError) {
            onModalClose();
        }
    }, [
        libgenSeriesIdHasError,
        libgenSeriesId,
        marvelId,
        monitored,
        rootFolderId,
        specialVersion,
        updateVolume,
        volumeFolder,
        volumeId,
        onModalClose,
    ]);

    const handleSavePress = useCallback(() => {
        if (isPathChanging && !isConfirmMoveModalOpen) {
            setIsConfirmMoveModalOpen(true);
        }
        else {
            setIsConfirmMoveModalOpen(false);
            saveVolume();
        }
    }, [isPathChanging, isConfirmMoveModalOpen, saveVolume]);

    const handleMoveVolumePress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
        saveVolume();
    }, [saveVolume]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('EditVolumeModalHeader', { title })}
            </ModalHeader>

            <ModalBody>
                <Form>
                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Monitored')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="monitored"
                            helpText={translate('MonitoredIssuesHelpText')}
                            value={monitored}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('SpecialVersion')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.VOLUME_TYPE_SELECT}
                            name="specialVersion"
                            value={specialVersion}
                            helpText={translate('SpecialVersionsHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('LibgenSeriesID')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="libgenSeriesId"
                            value={libgenSeriesId}
                            helpText={translate('LibgenSeriesIDHelpText')}
                            onChange={handleInputChange}
                            hasError={libgenSeriesIdHasError}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('MarvelID')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.NUMBER}
                            name="marvelId"
                            value={marvelId}
                            helpText={translate('MarvelIDHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Path')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="volumeFolder"
                            value={rootFolderPath + volumeFolder}
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
                rootFolderPath={rootFolderPath}
                onSavePress={handleRootFolderChange}
                onModalClose={handleRootFolderModalClose}
            />

            <MoveVolumeModal
                originalPath={initialVolumeFolder}
                destinationPath={volumeFolder}
                isOpen={isConfirmMoveModalOpen}
                onModalClose={handleCancelPress}
                onSavePress={handleSavePress}
                onMoveVolumePress={handleMoveVolumePress}
            />
        </ModalContent>
    );
}
