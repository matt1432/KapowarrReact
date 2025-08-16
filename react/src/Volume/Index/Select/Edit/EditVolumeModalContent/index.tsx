// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useMassEditMutation } from 'Store/Api/Command';
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';

// Misc
import { inputTypes, massEditActions } from 'Helpers/Props';

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

// CSS
import styles from './index.module.css';

// Types
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { InputChanged } from 'typings/inputs';

interface EditVolumeModalContentProps {
    volumeIds: number[];
    onSavePress(): void;
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
    const { data: rootFolders = [] } = useGetRootFoldersQuery(undefined);
    const [runMassEditAction] = useMassEditMutation();

    const [monitored, setMonitored] = useState(NO_CHANGE);
    const [rootFolderPath, setRootFolderPath] = useState(NO_CHANGE);

    const save = useCallback(() => {
        let hasChanges = false;

        if (monitored !== NO_CHANGE) {
            hasChanges = true;
            runMassEditAction({
                action:
                    monitored === 'monitored' ? massEditActions.MONITOR : massEditActions.UNMONITOR,
                volumeIds,
            });
        }

        if (rootFolderPath !== NO_CHANGE) {
            hasChanges = true;
            runMassEditAction({
                action: massEditActions.ROOT_FOLDER,
                volumeIds,
                args: {
                    rootFolderId: rootFolders.find((f) => f.folder === rootFolderPath)!.id,
                },
            });
        }

        if (hasChanges) {
            onSavePress();
        }

        onModalClose();
    }, [
        monitored,
        rootFolderPath,
        onSavePress,
        onModalClose,
        rootFolders,
        runMassEditAction,
        volumeIds,
    ]);

    const onInputChange = useCallback(
        ({ name, value }: InputChanged) => {
            switch (name) {
                case 'monitored':
                    setMonitored(value as string);
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

                    <Button onPress={save}>{translate('ApplyChanges')}</Button>
                </div>
            </ModalFooter>
        </ModalContent>
    );
}

export default EditVolumeModalContent;
