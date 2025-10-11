// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useGetDownloadClientsQuery } from 'Store/Api/DownloadClients';

import {
    useEditRemoteMappingMutation,
    useGetRemoteMappingsQuery,
} from 'Store/Api/RootFolders';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';
import type { RemoteMapping } from 'typings/RootFolder';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';

export interface EditRemoteMappingModalContentProps {
    id?: number;
    onDeleteRemoteMappingPress?: () => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function EditRemoteMappingModalContent({
    id,
    onDeleteRemoteMappingPress,
    onModalClose,
}: EditRemoteMappingModalContentProps) {
    const { data: downloadClientHosts = [] } = useGetDownloadClientsQuery();

    const { data, isFetching, error, refetch } = useGetRemoteMappingsQuery(
        undefined,
        {
            selectFromResult: ({ data = [], isFetching, error }) => ({
                data: data.find((rm) => rm.id === id),
                isFetching,
                error,
            }),
        },
    );

    const [saveRemoteMapping, { isLoading: isSaving, error: saveError }] =
        useEditRemoteMappingMutation();

    const [changes, setChanges] = useState<RemoteMapping>({
        id: id ?? 0,
        externalDownloadClientId: data?.externalDownloadClientId ?? 0,
        remotePath: data?.remotePath ?? '',
        localPath: data?.localPath ?? '',
    });

    const [prevData, setPrevData] = useState(data);
    if (data !== prevData) {
        setPrevData(data);
        setChanges({
            id: id ?? 0,
            externalDownloadClientId: data?.externalDownloadClientId ?? 0,
            remotePath: data?.remotePath ?? '',
            localPath: data?.localPath ?? '',
        });
    }

    const handleInputChange = useCallback(
        <Key extends keyof RemoteMapping, Prop extends RemoteMapping[Key]>({
            name,
            value,
        }: InputChanged<Key, Prop>) => {
            setChanges({
                ...changes,
                [name]: value,
            });
        },
        [changes],
    );

    const handleSavePress = useCallback(async () => {
        await saveRemoteMapping(changes);
        await refetch();
        onModalClose();
    }, [changes, onModalClose, refetch, saveRemoteMapping]);

    const hostOptions = useMemo<EnhancedSelectInputValue<number>[]>(
        () =>
            downloadClientHosts.map((client) => ({
                key: client.id,
                value: client.title,
            })),
        [downloadClientHosts],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {id
                    ? translate('EditRemoteMapping')
                    : translate('AddRemoteMapping')}
            </ModalHeader>

            <ModalBody className={styles.body}>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && !!error ? (
                    <Alert kind={kinds.DANGER}>
                        {translate('AddRemoteMappingError')}
                    </Alert>
                ) : null}

                {!isFetching && !error ? (
                    <Form>
                        <FormGroup>
                            <FormLabel>{translate('Host')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="externalDownloadClientId"
                                helpText={translate(
                                    'RemoteMappingHostHelpText',
                                )}
                                value={changes.externalDownloadClientId}
                                values={hostOptions}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('RemotePath')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="remotePath"
                                helpText={translate(
                                    'RemoteMappingRemotePathHelpText',
                                )}
                                value={changes.remotePath}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('LocalPath')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="localPath"
                                helpText={translate(
                                    'RemoteMappingLocalPathHelpText',
                                )}
                                value={changes.localPath}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                ) : null}
            </ModalBody>

            <ModalFooter>
                {id ? (
                    <Button
                        className={styles.deleteButton}
                        kind={kinds.DANGER}
                        onPress={onDeleteRemoteMappingPress}
                    >
                        {translate('Delete')}
                    </Button>
                ) : null}

                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <SpinnerErrorButton
                    isSpinning={isSaving}
                    error={saveError}
                    onPress={handleSavePress}
                >
                    {translate('Save')}
                </SpinnerErrorButton>
            </ModalFooter>
        </ModalContent>
    );
}
