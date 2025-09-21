// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';

import { setAddVolumeOption } from 'Store/Slices/AddVolume';
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';
import { useAddVolumeMutation, useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import InnerHTML from 'Components/InnerHTML';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import SpinnerButton from 'Components/Link/SpinnerButton';
import VolumePoster from 'Volume/VolumePoster';
import SpecialVersionPopoverContent from 'AddVolume/SpecialVersionPopoverContent';

// CSS
import styles from './index.module.css';

// Types
import type { AddVolume } from 'AddVolume/AddVolume';
import type { CheckInputChanged, InputChanged } from 'typings/Inputs';
import type { MonitoringScheme } from 'Volume/Volume';
import type { SpecialVersion } from 'Helpers/Props/specialVersions';
import CheckInput from 'Components/Form/CheckInput';

export interface AddNewVolumeModalContentProps {
    volume: AddVolume;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function AddNewVolumeModalContent({
    volume,
    onModalClose,
}: AddNewVolumeModalContentProps) {
    const dispatch = useRootDispatch();

    const { title, year, description } = volume;

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);

    const { monitoringScheme, rootFolder, specialVersion, autoSearch } = useRootSelector(
        (state) => state.addVolume,
    );

    const { data: rootFolders = [] } = useGetRootFoldersQuery();
    const { refetch } = useGetVolumesQuery();

    const [addVolume, { isLoading: isAdding }] = useAddVolumeMutation();

    const [rootFolderPath, setRootFolderPath] = useState('');

    useEffect(() => {
        if (rootFolderPath === '' && rootFolders.length !== 0) {
            setRootFolderPath(rootFolders[0].folder);
        }
    }, [rootFolderPath, rootFolders]);

    const handleRootFolderChange = useCallback(
        ({ value }: InputChanged<'rootFolder', string>) => {
            const folder = rootFolders.find((f) => f.folder === value);

            if (folder) {
                setRootFolderPath(folder.folder);
                dispatch(setAddVolumeOption('rootFolder', folder));
            }
        },
        [dispatch, rootFolders],
    );

    const handleMonitoringSchemeChange = useCallback(
        ({ value }: InputChanged<'monitoringScheme', MonitoringScheme>) => {
            dispatch(setAddVolumeOption('monitoringScheme', value));
        },
        [dispatch],
    );

    const handleSpecialVersionChange = useCallback(
        ({ value }: InputChanged<'specialVersion', SpecialVersion>) => {
            dispatch(setAddVolumeOption('specialVersion', value));
        },
        [dispatch],
    );

    const handleAutoSearchChange = useCallback(
        ({ value }: CheckInputChanged<'autoSearch'>) => {
            dispatch(setAddVolumeOption('autoSearch', value));
        },
        [dispatch],
    );

    const handleAddVolumeSuccess = useCallback(() => {
        refetch();

        onModalClose();
    }, [onModalClose, refetch]);

    const handleAddVolumePress = useCallback(() => {
        addVolume({
            ...volume,
            rootFolderId: rootFolder?.id ?? 1,
            monitoringScheme,
            monitor: monitoringScheme !== 'none',
            specialVersion: specialVersion === '' ? null : specialVersion,
            autoSearch,
        }).then(() => handleAddVolumeSuccess());
    }, [
        volume,
        specialVersion,
        monitoringScheme,
        addVolume,
        rootFolder,
        handleAddVolumeSuccess,
        autoSearch,
    ]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {title}

                {!title.includes(String(year)) && year ? (
                    <span className={styles.year}>({year})</span>
                ) : null}
            </ModalHeader>

            <ModalBody>
                <div className={styles.container}>
                    {isSmallScreen ? null : (
                        <div className={styles.poster}>
                            <VolumePoster volume={volume} className={styles.poster} size={250} />
                        </div>
                    )}

                    <div className={styles.info}>
                        {description ? (
                            <div className={styles.description}>
                                <InnerHTML innerHTML={description} />
                            </div>
                        ) : null}

                        <Form>
                            <FormGroup>
                                <FormLabel>{translate('RootFolder')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.ROOT_FOLDER_SELECT}
                                    name="rootFolder"
                                    value={rootFolderPath}
                                    valueOptions={{
                                        volumeFolder: volume.folderName,
                                    }}
                                    selectedValueOptions={{
                                        volumeFolder: volume.folderName,
                                    }}
                                    helpText={translate('AddNewVolumeRootFolderHelpText', {
                                        folder: volume.folderName,
                                    })}
                                    onChange={handleRootFolderChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('Monitor')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.MONITOR_ISSUES_SELECT}
                                    name="monitoringScheme"
                                    onChange={handleMonitoringSchemeChange}
                                    value={monitoringScheme}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('SpecialVersion')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('SpecialVersions')}
                                        body={<SpecialVersionPopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.VOLUME_TYPE_SELECT}
                                    name="specialVersion"
                                    onChange={handleSpecialVersionChange}
                                    value={specialVersion ?? ''}
                                    helpText={translate('SpecialVersionsHelpText')}
                                />
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className={styles.modalFooter}>
                <label className={styles.searchLabelContainer}>
                    <span className={styles.searchLabel}>
                        {translate('AddNewVolumeSearchForMissingIssues')}
                    </span>

                    <CheckInput
                        containerClassName={styles.searchInputContainer}
                        className={styles.searchInput}
                        name="autoSearch"
                        onChange={handleAutoSearchChange}
                        value={autoSearch}
                    />
                </label>
                <SpinnerButton
                    className={styles.addButton}
                    kind={kinds.SUCCESS}
                    isSpinning={isAdding}
                    onPress={handleAddVolumePress}
                >
                    {translate('AddVolumeWithTitle', { title })}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}
