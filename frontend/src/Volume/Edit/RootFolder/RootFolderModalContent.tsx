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

// Types
import type { InputChanged } from 'typings/Inputs';

export interface RootFolderUpdated {
    newRootFolderPath: string;
}

export interface RootFolderModalContentProps {
    rootFolderPath: string;
    onSavePress(change: RootFolderUpdated): void;
    onModalClose(): void;
}

// IMPLEMENTATIONS

export default function RootFolderModalContent({
    onSavePress,
    onModalClose,
    rootFolderPath: initRootFolderPath,
}: RootFolderModalContentProps) {
    const [rootFolderPath, setRootFolderPath] = useState(initRootFolderPath);

    const onInputChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setRootFolderPath(value);
        },
        [],
    );

    const handleSavePress = useCallback(() => {
        onSavePress({ newRootFolderPath: rootFolderPath });
    }, [rootFolderPath, onSavePress]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('UpdateVolumePath')}</ModalHeader>

            <ModalBody>
                <FormGroup>
                    <FormLabel>{translate('RootFolder')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.ROOT_FOLDER_SELECT}
                        name="rootFolderPath"
                        value={rootFolderPath}
                        selectedValueOptions={{ includeFreeSpace: false }}
                        helpText={translate('VolumeEditRootFolderHelpText')}
                        onChange={onInputChange}
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button onPress={handleSavePress}>
                    {translate('UpdatePath')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
