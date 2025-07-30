// TODO:
// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';

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
import type { InputChanged } from 'typings/inputs';

export interface RootFolderUpdated {
    path: string;
    rootFolderPath: string;
}

export interface RootFolderModalContentProps {
    volumeId: number;
    rootFolderPath: string;
    onSavePress(change: RootFolderUpdated): void;
    onModalClose(): void;
}

interface VolumeFolder {
    folder: string;
}

// IMPLEMENTATIONS

function RootFolderModalContent(props: RootFolderModalContentProps) {
    const { /* volumeId, */ onSavePress, onModalClose } = props;
    // const { isWindows } = useSelector(createSystemStatusSelector());
    const isWindows = false;

    const [rootFolderPath, setRootFolderPath] = useState(props.rootFolderPath);

    const { isLoading, data } = { isLoading: false, data: {} as VolumeFolder }; // useApiQuery<VolumeFolder>({
    //     path: `/volumes/${volumeId}/folder`,
    // });

    const onInputChange = useCallback(({ value }: InputChanged<string>) => {
        setRootFolderPath(value);
    }, []);

    const handleSavePress = useCallback(() => {
        const separator = isWindows ? '\\' : '/';

        onSavePress({
            path: `${rootFolderPath}${separator}${data?.folder}`,
            rootFolderPath,
        });
    }, [rootFolderPath, isWindows, data, onSavePress]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('UpdateVolumePath')}</ModalHeader>

            <ModalBody>
                <FormGroup>
                    <FormLabel>{translate('RootFolder')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.ROOT_FOLDER_SELECT}
                        name="rootFolderPath"
                        // value={rootFolderPath}
                        valueOptions={{
                            volumeFolder: data?.folder,
                            isWindows,
                        }}
                        selectedValueOptions={{
                            volumeFolder: data?.folder,
                            isWindows,
                        }}
                        helpText={translate('VolumeEditRootFolderHelpText')}
                        onChange={onInputChange}
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button disabled={isLoading || !data?.folder} onPress={handleSavePress}>
                    {translate('UpdatePath')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default RootFolderModalContent;
