// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useImportBackupMutation } from 'Store/Api/Status';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SpinnerButton from 'Components/Link/SpinnerButton';

// Types
import type { CheckInputChanged } from 'typings/Inputs';

interface ImportBackupModalProps {
    isOpen: boolean;
    index: number;
    filename: string;
    creationDate: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function ImportBackupModal({
    isOpen,
    index,
    filename,
    creationDate,
    onModalClose,
}: ImportBackupModalProps) {
    const [importBackup, { isLoading, error }] = useImportBackupMutation();

    const [copyHostingSettings, setCopyHostingSettings] = useState(false);

    const handleCopyHostingSettingsChange = useCallback(
        ({ value }: CheckInputChanged<'copyHostingSettings'>) => {
            setCopyHostingSettings(value);
        },
        [],
    );

    const handleImportPress = useCallback(async () => {
        const { error } = await importBackup({ index, copyHostingSettings });
        if (error) {
            return;
        }

        setTimeout(() => window.location.reload(), 1000);
    }, [copyHostingSettings, importBackup, index]);

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ModalContent onModalClose={onModalClose}>
                <ModalHeader>{translate('ImportDatabase')}</ModalHeader>

                <ModalBody>
                    {error ? (
                        <Alert kind={kinds.DANGER}>
                            {getErrorMessage(error)}
                        </Alert>
                    ) : null}

                    <p>
                        {translate('ImportDatabaseMessage', {
                            filename,
                            date: new Date(
                                creationDate * 1000,
                            ).toLocaleString(),
                        })}
                    </p>

                    <Form>
                        <FormGroup>
                            <FormLabel>
                                {translate('KeepHostingSettings')}
                            </FormLabel>

                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="copyHostingSettings"
                                helpText={translate(
                                    'KeepHostingSettingsImportHelpText',
                                )}
                                onChange={handleCopyHostingSettingsChange}
                                value={copyHostingSettings}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button onPress={onModalClose}>
                        {translate('Cancel')}
                    </Button>

                    <SpinnerButton
                        kind={kinds.DANGER}
                        isSpinning={isLoading}
                        onPress={handleImportPress}
                    >
                        {translate('Import')}
                    </SpinnerButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
