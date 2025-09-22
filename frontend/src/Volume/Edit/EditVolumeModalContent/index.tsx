// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';
import {
    useGetVolumesQuery,
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
    type UpdateVolumeParams,
} from 'Store/Api/Volumes';

// Misc
import { icons, inputTypes, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import usePrevious from 'Helpers/Hooks/usePrevious';
import useSocketEvents from 'Helpers/Hooks/useSocketEvents';

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
    const [updateVolume, { isLoading: isSaving, error: saveError }] = useUpdateVolumeMutation();

    // Update volumes cache after changes
    const { refetch: refetchAllVolumes } = useGetVolumesQuery(undefined, {
        selectFromResult: () => ({}),
    });

    const { data: rootFolders = [] } = useGetRootFoldersQuery();

    const { data: volume, refetch } = useSearchVolumeQuery(
        { volumeId },
        { refetchOnMountOrArgChange: true },
    );
    const {
        title,
        libgenSeriesId: initialLibgenSeriesId,
        monitored: initialMonitored,
        specialVersion: initialSpecialVersion,
        volumeFolder: initialVolumeFolder,
        rootFolder: initialRootFolderPath,
    } = volume!;

    const wasSaving = usePrevious(isSaving);

    const [isRootFolderModalOpen, setIsRootFolderModalOpen] = useState(false);
    const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false);

    const [rootFolderId, setRootFolderId] = useState(initialRootFolderPath);
    const rootFolderPath = useMemo(
        () => rootFolders.find((f) => f.id === rootFolderId)?.folder ?? '',
        [rootFolderId, rootFolders],
    );

    const [monitored, setMonitored] = useState(initialMonitored);
    const [specialVersion, setSpecialVersion] = useState(initialSpecialVersion ?? '');
    const [libgenSeriesId, setLibgenSeriesId] = useState(initialLibgenSeriesId ?? null);
    const [volumeFolder, setVolumeFolder] = useState(initialVolumeFolder);

    const isPathChanging = useMemo(
        () => initialVolumeFolder !== volumeFolder,
        [initialVolumeFolder, volumeFolder],
    );

    useEffect(() => {
        setLibgenSeriesId(initialLibgenSeriesId ?? null);
        setMonitored(initialMonitored);
        setSpecialVersion(initialSpecialVersion ?? '');
        setVolumeFolder(initialVolumeFolder);
        setRootFolderId(initialRootFolderPath);
    }, [
        initialLibgenSeriesId,
        initialMonitored,
        initialSpecialVersion,
        initialVolumeFolder,
        initialRootFolderPath,
    ]);

    useSocketEvents({
        volumeUpdated: (vol) => {
            if (vol.id === volumeId) {
                refetch();
            }
        },
    });

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
                    setLibgenSeriesId(value as number | null);
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
            setRootFolderId(rootFolders.find((f) => f.folder === newRootFolderPath)!.id);
            handleInputChange({ name: 'volumeFolder', value: volumeFolder });
        },
        [handleInputChange, rootFolders, volumeFolder],
    );

    const handleCancelPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
    }, []);

    const saveVolume = useCallback(() => {
        updateVolume({
            volumeId,
            rootFolder: rootFolderId,
            monitored,
            specialVersion: specialVersion === '' ? null : specialVersion,
            specialVersionLocked: true,
            volumeFolder,
            libgenSeriesId,
        }).then(() => {
            refetchAllVolumes();
        });
    }, [
        libgenSeriesId,
        monitored,
        rootFolderId,
        specialVersion,
        updateVolume,
        volumeFolder,
        volumeId,
        refetchAllVolumes,
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

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('EditVolumeModalHeader', { title })}</ModalHeader>

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
                            type={inputTypes.NUMBER}
                            name="libgenSeriesId"
                            value={libgenSeriesId}
                            helpText={translate('LibgenSeriesIDHelpText')}
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
