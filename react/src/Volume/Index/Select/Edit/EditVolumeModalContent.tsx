// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import MoveVolumeModal from 'Volume/MoveVolume/MoveVolumeModal';

// CSS
import styles from './EditVolumeModalContent.module.css';

// Types
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { InputChanged } from 'typings/inputs';

interface SavePayload {
    monitored?: boolean;
    monitorNewItems?: string;
    qualityProfileId?: number;
    specialVersion?: string;
    rootFolderPath?: string;
    moveFiles?: boolean;
}

interface EditVolumeModalContentProps {
    volumeIds: number[];
    onSavePress(payload: object): void;
    onModalClose(): void;
}

// IMPLEMENTATIONS

const NO_CHANGE = 'noChange';

const monitoredOptions: EnhancedSelectInputValue<string>[] = [
    {
        key: NO_CHANGE,
        get value() {
            return translate('NoChange');
        },
        isDisabled: true,
    },
    {
        key: 'monitored',
        get value() {
            return translate('Monitored');
        },
    },
    {
        key: 'unmonitored',
        get value() {
            return translate('Unmonitored');
        },
    },
];

function EditVolumeModalContent({
    volumeIds,
    onSavePress,
    onModalClose,
}: EditVolumeModalContentProps) {
    const [monitored, setMonitored] = useState(NO_CHANGE);
    const [monitorNewItems, setMonitorNewItems] = useState(NO_CHANGE);
    const [qualityProfileId, setQualityProfileId] = useState<string | number>(NO_CHANGE);
    const [specialVersion, setSpecialVersion] = useState(NO_CHANGE);
    const [rootFolderPath, setRootFolderPath] = useState(NO_CHANGE);
    const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false);

    const save = useCallback(
        (moveFiles: boolean) => {
            let hasChanges = false;
            const payload: SavePayload = {};

            if (monitored !== NO_CHANGE) {
                hasChanges = true;
                payload.monitored = monitored === 'monitored';
            }

            if (monitorNewItems !== NO_CHANGE) {
                hasChanges = true;
                payload.monitorNewItems = monitorNewItems;
            }

            if (qualityProfileId !== NO_CHANGE) {
                hasChanges = true;
                payload.qualityProfileId = qualityProfileId as number;
            }

            if (specialVersion !== NO_CHANGE) {
                hasChanges = true;
                payload.specialVersion = specialVersion;
            }

            if (rootFolderPath !== NO_CHANGE) {
                hasChanges = true;
                payload.rootFolderPath = rootFolderPath;
                payload.moveFiles = moveFiles;
            }

            if (hasChanges) {
                onSavePress(payload);
            }

            onModalClose();
        },
        [
            monitored,
            monitorNewItems,
            qualityProfileId,
            specialVersion,
            rootFolderPath,
            onSavePress,
            onModalClose,
        ],
    );

    const onInputChange = useCallback(
        ({ name, value }: InputChanged) => {
            switch (name) {
                case 'monitored':
                    setMonitored(value as string);
                    break;
                case 'monitorNewItems':
                    setMonitorNewItems(value as string);
                    break;
                case 'qualityProfileId':
                    setQualityProfileId(value as string);
                    break;
                case 'specialVersion':
                    setSpecialVersion(value as string);
                    break;
                case 'rootFolderPath':
                    setRootFolderPath(value as string);
                    break;
                default:
                    console.warn('EditVolumeModalContent Unknown Input');
            }
        },
        [setMonitored],
    );

    const onSavePressWrapper = useCallback(() => {
        if (rootFolderPath === NO_CHANGE) {
            save(false);
        }
        else {
            setIsConfirmMoveModalOpen(true);
        }
    }, [rootFolderPath, save]);

    const onCancelPress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
    }, [setIsConfirmMoveModalOpen]);

    const onDoNotMoveVolumePress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
        save(false);
    }, [setIsConfirmMoveModalOpen, save]);

    const onMoveVolumePress = useCallback(() => {
        setIsConfirmMoveModalOpen(false);
        save(true);
    }, [setIsConfirmMoveModalOpen, save]);

    const selectedCount = volumeIds.length;

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('EditSelectedVolume')}</ModalHeader>

            <ModalBody>
                <FormGroup>
                    <FormLabel>{translate('Monitored')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.SELECT}
                        name="monitored"
                        value={monitored}
                        values={monitoredOptions}
                        onChange={onInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>{translate('MonitorNewItems')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.MONITOR_NEW_ITEMS_SELECT}
                        name="monitorNewItems"
                        value={monitorNewItems}
                        includeNoChange={true}
                        includeNoChangeDisabled={false}
                        onChange={onInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>{translate('SpecialVersion')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.VOLUME_TYPE_SELECT}
                        name="specialVersion"
                        value={specialVersion}
                        includeNoChange={true}
                        includeNoChangeDisabled={false}
                        helpText={translate('SpecialVersionsHelpText')}
                        onChange={onInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>{translate('RootFolder')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.ROOT_FOLDER_SELECT}
                        name="rootFolderPath"
                        selectedValueOptions={{ includeFreeSpace: false }}
                        helpText={translate('VolumeEditRootFolderHelpText')}
                        onChange={onInputChange}
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter className={styles.modalFooter}>
                <div className={styles.selected}>
                    {translate('CountVolumeSelected', { count: selectedCount })}
                </div>

                <div>
                    <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                    <Button onPress={onSavePressWrapper}>{translate('ApplyChanges')}</Button>
                </div>
            </ModalFooter>

            <MoveVolumeModal
                isOpen={isConfirmMoveModalOpen}
                destinationRootFolder={rootFolderPath}
                onModalClose={onCancelPress}
                onSavePress={onDoNotMoveVolumePress}
                onMoveVolumePress={onMoveVolumePress}
            />
        </ModalContent>
    );
}

export default EditVolumeModalContent;
