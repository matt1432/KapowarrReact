// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useUploadDatabaseMutation } from 'Store/Api/Status';

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
import type { CheckInputChanged, FileInputChanged } from 'typings/Inputs';

interface UploadDatabaseModalProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function UploadDatabaseModal({
    isOpen,
    onModalClose,
}: UploadDatabaseModalProps) {
    const [uploadDatabase, { isLoading, error }] = useUploadDatabaseMutation();

    const [file, setFile] = useState<File | null>(null);
    const [filename, setFilename] = useState('');
    const [copyHostingSettings, setCopyHostingSettings] = useState(false);

    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        setFile(null);
        setFilename('');
        setCopyHostingSettings(false);
    }

    const handleFileChange = useCallback(
        ({ value, files }: FileInputChanged<'file'>) => {
            setFilename(value);
            setFile(files?.[0] ?? null);
        },
        [],
    );

    const handleCopyHostingSettingsChange = useCallback(
        ({ value }: CheckInputChanged<'copyHostingSettings'>) => {
            setCopyHostingSettings(value);
        },
        [],
    );

    const handleImportPress = useCallback(async () => {
        if (!file) {
            return;
        }

        const { error } = await uploadDatabase({ file, copyHostingSettings });
        if (error) {
            setFile(null);
            setFilename('');
            return;
        }

        setTimeout(() => window.location.reload(), 1000);
    }, [copyHostingSettings, file, uploadDatabase]);

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ModalContent onModalClose={onModalClose}>
                <ModalHeader>{translate('UploadDatabase')}</ModalHeader>

                <ModalBody>
                    {error ? (
                        <Alert kind={kinds.DANGER}>
                            {getErrorMessage(error)}
                        </Alert>
                    ) : null}

                    <p>{translate('UploadDatabaseMessage')}</p>

                    <Form>
                        <FormGroup>
                            <FormLabel>{translate('DatabaseFile')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.FILE}
                                name="file"
                                onChange={handleFileChange}
                                value={filename}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('KeepHostingSettings')}
                            </FormLabel>

                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="copyHostingSettings"
                                helpText={translate(
                                    'KeepHostingSettingsUploadHelpText',
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
                        isDisabled={!file}
                        onPress={handleImportPress}
                    >
                        {translate('Import')}
                    </SpinnerButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
