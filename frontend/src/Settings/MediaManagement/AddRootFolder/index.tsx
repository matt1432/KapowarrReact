// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useAddRootFolderMutation } from 'Store/Api/RootFolders';

// Misc
import { icons, inputTypes, kinds, sizes } from 'Helpers/Props';
import { getErrorMessage, isApiError } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import ModalContent from 'Components/Modal/ModalContent';
import ModalHeader from 'Components/Modal/ModalHeader';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

export default function AddRootFolder() {
    const [addRootFolder, { isLoading: isSaving, error: saveError }] = useAddRootFolderMutation();

    const [isAddNewRootFolderModalOpen, setIsAddNewRootFolderModalOpen] = useState(false);

    const onAddNewRootFolderPress = useCallback(() => {
        setIsAddNewRootFolderModalOpen(true);
    }, [setIsAddNewRootFolderModalOpen]);

    const [folder, setFolder] = useState('');
    const handleFolderChange = useCallback(({ value }: InputChanged<'folder', string>) => {
        setFolder(value);
    }, []);

    const onNewRootFolderSelect = useCallback(() => {
        addRootFolder({ folder });
    }, [addRootFolder, folder]);

    const onAddRootFolderModalClose = useCallback(() => {
        setIsAddNewRootFolderModalOpen(false);
    }, [setIsAddNewRootFolderModalOpen]);

    return (
        <>
            {!isSaving && saveError && isApiError(saveError) ? (
                <Alert kind={kinds.DANGER}>
                    {translate('AddRootFolderError')}

                    <ul>
                        <li>
                            {saveError.status === 400
                                ? translate('RootFolderInvalid')
                                : getErrorMessage(saveError)}
                        </li>
                    </ul>
                </Alert>
            ) : null}

            <div className={styles.addRootFolderButtonContainer}>
                <Button kind={kinds.PRIMARY} size={sizes.LARGE} onPress={onAddNewRootFolderPress}>
                    <Icon className={styles.importButtonIcon} name={icons.DRIVE} />
                    {translate('AddRootFolder')}
                </Button>

                <Modal
                    isOpen={isAddNewRootFolderModalOpen}
                    onModalClose={onAddRootFolderModalClose}
                >
                    <ModalContent onModalClose={onAddRootFolderModalClose}>
                        <ModalHeader>{translate('AddRootFolder')}</ModalHeader>

                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <FormLabel>{translate('RootFolderPath')}</FormLabel>

                                    <FormInputGroup
                                        type={inputTypes.TEXT}
                                        name="folder"
                                        value={folder}
                                        onChange={handleFolderChange}
                                        onSubmit={onNewRootFolderSelect}
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button onPress={onAddRootFolderModalClose}>
                                {translate('Cancel')}
                            </Button>

                            <Button kind={kinds.PRIMARY} onPress={onNewRootFolderSelect}>
                                {translate('Add')}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
