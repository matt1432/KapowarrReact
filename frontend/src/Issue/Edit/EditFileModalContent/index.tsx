// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import {
    useGetFileQuery,
    useUpdateFileMutation,
    type UpdateFileParams,
} from 'Store/Api/Files';

// Misc
import { inputTypes, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import usePrevious from 'Helpers/Hooks/usePrevious';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

export interface EditFileModalContentProps {
    fileId: number;
    onModalClose: () => void;
    onDeleteFilePress: () => void;
    refetchFiles: () => void;
}

// IMPLEMENTATIONS

export default function EditFileModalContent({
    fileId,
    onModalClose,
    onDeleteFilePress,
    refetchFiles,
}: EditFileModalContentProps) {
    const [updateFile, { isLoading: isSaving, error: saveError }] =
        useUpdateFileMutation();

    const {
        title,
        initialDpi,
        initialReleaser,
        initialResolution,
        initialScanType,
        isPopulated: _isPopulated,
    } = useGetFileQuery(
        { fileId },
        {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({ data: file, isUninitialized }) => ({
                title: file?.filepath?.split('/').at(-1) ?? '',
                initialDpi: file?.dpi ?? '',
                initialReleaser: file?.releaser ?? '',
                initialResolution: file?.resolution ?? '',
                initialScanType: file?.scanType ?? '',
                isPopulated: !isUninitialized,
            }),
        },
    );

    const [dpi, setDpi] = useState(initialDpi);
    const [releaser, setReleaser] = useState(initialReleaser);
    const [resolution, setResolution] = useState(initialResolution);
    const [scanType, setScanType] = useState(initialScanType);

    const wasSaving = usePrevious(isSaving);

    // For some reason the values are only available after isPopulated is true, not at the same time
    const isPopulated = usePrevious(_isPopulated);
    const wasPopulated = usePrevious(isPopulated);

    useEffect(() => {
        if (!wasPopulated && isPopulated) {
            setDpi(initialDpi);
            setReleaser(initialReleaser);
            setResolution(initialResolution);
            setScanType(initialScanType);
        }
    }, [
        isPopulated,
        wasPopulated,
        initialDpi,
        initialReleaser,
        initialResolution,
        initialScanType,
    ]);

    const handleInputChange = useCallback(
        <K extends keyof UpdateFileParams>({
            name,
            value,
        }: InputChanged<K, string>) => {
            switch (name) {
                case 'dpi':
                    setDpi(value);
                    break;
                case 'releaser':
                    setReleaser(value);
                    break;
                case 'resolution':
                    setResolution(value);
                    break;
                case 'scanType':
                    setScanType(value);
                    break;
            }
        },
        [],
    );

    const handleSavePress = useCallback(() => {
        updateFile({
            fileId,
            dpi,
            releaser,
            resolution,
            scanType,
        }).then(() => {
            refetchFiles();
        });
    }, [dpi, releaser, resolution, scanType, updateFile, fileId, refetchFiles]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('EditFileModalHeader', { title })}
            </ModalHeader>

            <ModalBody>
                <Form>
                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('DPI')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="dpi"
                            value={dpi}
                            helpText={translate('DPIHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('ReleaseGroup')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="releaser"
                            value={releaser}
                            helpText={translate('ReleaseGroupHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('Resolution')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="resolution"
                            value={resolution}
                            helpText={translate('ResolutionHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>

                    <FormGroup size={sizes.MEDIUM}>
                        <FormLabel>{translate('ScanType')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="scanType"
                            value={scanType}
                            helpText={translate('ScanTypeHelpText')}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button
                    className={styles.deleteButton}
                    kind={kinds.DANGER}
                    onPress={onDeleteFilePress}
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
        </ModalContent>
    );
}
