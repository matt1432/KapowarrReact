// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { setAddVolumeOption } from 'Store/Slices/AddVolume';
import {
    useAddVolumeMutation,
    useGetRootFoldersQuery,
    useGetVolumesQuery,
} from 'Store/createApiEndpoints';

// Misc
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import SpinnerButton from 'Components/Link/SpinnerButton';
import VolumeMonitoringOptionsPopoverContent from 'AddVolume/VolumeMonitoringOptionsPopoverContent';
import VolumePoster from 'Volume/VolumePoster';
import SpecialVersionPopoverContent from 'AddVolume/SpecialVersionPopoverContent';

// CSS
import styles from './index.module.css';

// Types
import type { AddVolume } from 'AddVolume/AddVolume';
import type { InputChanged } from 'typings/inputs';
import type { MonitoringScheme, SpecialVersion } from 'Volume/Volume';
import InnerHTML from 'Components/InnerHTML';

export interface AddNewVolumeModalContentProps {
    volume: AddVolume;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function AddNewVolumeModalContent({ volume, onModalClose }: AddNewVolumeModalContentProps) {
    const { title, year, description } = volume;

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);
    const { monitoringScheme, rootFolder, specialVersion } = useRootSelector(
        (state) => state.addVolume,
    );

    const { data: rootFolders } = useGetRootFoldersQuery(undefined);
    const { refetch } = useGetVolumesQuery(undefined);

    const [addVolume, addVolumeState] = useAddVolumeMutation();

    const isAdding = useMemo(() => {
        return addVolumeState.isLoading;
    }, [addVolumeState]);

    const handleRootFolderChange = useCallback(
        ({ value }: InputChanged<string>) => {
            const folder = rootFolders?.find((f) => f.folder === value);

            if (folder) {
                setAddVolumeOption('rootFolder', folder);
            }
        },
        [rootFolders],
    );

    const handleMonitoringSchemeChange = useCallback(({ value }: InputChanged<string>) => {
        setAddVolumeOption('monitoringScheme', value as MonitoringScheme);
    }, []);

    const handleSpecialVersionChange = useCallback(({ value }: InputChanged<string>) => {
        setAddVolumeOption('specialVersion', value as SpecialVersion);
    }, []);

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
            specialVersion,
        }).then(() => handleAddVolumeSuccess());
    }, [volume, specialVersion, monitoringScheme, addVolume, rootFolder, handleAddVolumeSuccess]);

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
                                    name="rootFolderPath"
                                    valueOptions={{
                                        volumeFolder: volume.title + '...',
                                    }}
                                    selectedValueOptions={{
                                        volumeFolder: volume.title + '...',
                                    }}
                                    helpText={translate('AddNewVolumeRootFolderHelpText', {
                                        folder: volume.title + '...',
                                    })}
                                    onChange={handleRootFolderChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('Monitor')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('MonitoringOptions')}
                                        body={<VolumeMonitoringOptionsPopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.MONITOR_ISSUES_SELECT}
                                    name="monitor"
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

export default AddNewVolumeModalContent;
