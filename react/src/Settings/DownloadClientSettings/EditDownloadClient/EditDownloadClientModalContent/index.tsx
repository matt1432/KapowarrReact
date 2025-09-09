// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import {
    useGetDownloadClientOptionsQuery,
    useGetDownloadClientQuery,
    useSaveDownloadClientMutation,
    useTestDownloadClientMutation,
} from 'Store/Api/DownloadClients';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import pickProps from 'Utilities/Object/pickProps';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';
import type { DownloadClient } from 'typings/DownloadClient';

type PotentialDownloadClient = Omit<DownloadClient, 'id' | 'downloadType'>;

export interface EditDownloadClientModalContentProps {
    id?: number;
    clientType?: string;
    onModalClose: () => void;
    onDeleteDownloadClientPress?: () => void;
}

// IMPLEMENTATIONS

function isPotentialClient(
    client: DownloadClient | PotentialDownloadClient,
): client is PotentialDownloadClient {
    return !('id' in client);
}

export default function EditDownloadClientModalContent({
    id,
    clientType: initialClientType,
    onModalClose,
    onDeleteDownloadClientPress,
}: EditDownloadClientModalContentProps) {
    const {
        data: client,
        isFetching: isFetchingClient,
        isSuccess,
        refetch,
    } = useGetDownloadClientQuery({ id });

    const { data: allOptions, isFetching: isFetchingOptions } = useGetDownloadClientOptionsQuery();

    const [testDownloadClient, { isLoading: isTesting }] = useTestDownloadClientMutation();
    const [saveDownloadClient, { error: saveError }] = useSaveDownloadClientMutation();

    const clientType = useMemo(
        () => initialClientType ?? client?.clientType ?? '',
        [client, initialClientType],
    );

    const clientOptions = useMemo(() => allOptions?.[clientType] ?? [], [allOptions, clientType]);

    const isFetching = useMemo(
        () => isFetchingClient || isFetchingOptions,
        [isFetchingClient, isFetchingOptions],
    );

    const [isSaving, setIsSaving] = useState(false);

    const [changes, setChanges] = useState<DownloadClient | PotentialDownloadClient>(
        client ?? {
            title: '',
            clientType: '',
            baseUrl: '',
            username: undefined,
            password: undefined,
            apiToken: undefined,
        },
    );
    useEffect(() => {
        if (isSuccess) {
            setIsSaving(false);
            setChanges(client!);
        }
    }, [isSuccess, client]);

    const handleInputChange = useCallback(
        <Key extends keyof DownloadClient>({
            name,
            value,
        }: InputChanged<Key, DownloadClient[Key]>) => {
            setChanges({
                ...changes,
                [name]: value,
            });
        },
        [changes],
    );

    const handleTestPress = useCallback(async () => {
        return await testDownloadClient({
            clientType,
            ...pickProps(changes, 'baseUrl', 'username', 'password', 'apiToken'),
        });
    }, [changes, clientType, testDownloadClient]);

    const handleSavePress = useCallback(async () => {
        setIsSaving(true);

        const { error: testError } = await handleTestPress();
        if (testError) {
            setIsSaving(false);
            return;
        }

        const identifier = isPotentialClient(changes) ? { clientType } : { id };

        const { error } = await saveDownloadClient({
            ...identifier,
            ...pickProps(changes, 'title', 'baseUrl', 'username', 'password', 'apiToken'),
        });
        if (error) {
            setIsSaving(false);
            return;
        }

        onModalClose();
        await refetch();
        setIsSaving(false);
    }, [changes, clientType, id, handleTestPress, onModalClose, refetch, saveDownloadClient]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('EditDownloadClientImplementation', {
                    implementationName: client?.clientType ?? '',
                })}
            </ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && saveError ? (
                    <Alert kind={kinds.DANGER}>{getErrorMessage(saveError)}</Alert>
                ) : null}

                {!isFetching ? (
                    <Form>
                        {clientOptions.includes('title') ? (
                            <FormGroup>
                                <FormLabel>{translate('Title')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="title"
                                    onChange={handleInputChange}
                                    value={changes.title}
                                />
                            </FormGroup>
                        ) : null}

                        {clientOptions.includes('base_url') ? (
                            <FormGroup>
                                <FormLabel>{translate('UrlBase')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="baseUrl"
                                    helpText="E.g. 'http://192.168.2.15:8008/torrent_client'"
                                    onChange={handleInputChange}
                                    value={changes.baseUrl}
                                />
                            </FormGroup>
                        ) : null}

                        {clientOptions.includes('username') ? (
                            <FormGroup>
                                <FormLabel>{translate('Username')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="username"
                                    onChange={handleInputChange}
                                    value={changes.username ?? ''}
                                />
                            </FormGroup>
                        ) : null}

                        {clientOptions.includes('password') ? (
                            <FormGroup>
                                <FormLabel>{translate('Password')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="password"
                                    onChange={handleInputChange}
                                    value={changes.password ?? ''}
                                />
                            </FormGroup>
                        ) : null}

                        {clientOptions.includes('api_token') ? (
                            <FormGroup>
                                <FormLabel>{translate('ApiKey')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="apiToken"
                                    onChange={handleInputChange}
                                    value={changes.apiToken ?? ''}
                                />
                            </FormGroup>
                        ) : null}
                    </Form>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button
                    className={styles.deleteButton}
                    kind={kinds.DANGER}
                    onPress={onDeleteDownloadClientPress}
                >
                    {translate('Delete')}
                </Button>

                <SpinnerErrorButton
                    isSpinning={isTesting}
                    error={saveError}
                    onPress={handleTestPress}
                >
                    {translate('Test')}
                </SpinnerErrorButton>

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
