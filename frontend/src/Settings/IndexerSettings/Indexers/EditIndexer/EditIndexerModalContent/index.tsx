// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import {
    useGetIndexerOptionsQuery,
    useGetIndexersQuery,
    useSaveIndexerMutation,
    useTestIndexerMutation,
} from 'Store/Api/Indexers';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';
import GCDownloadSources from 'Helpers/Props/GCDownloadSources';
import { getErrorMessage } from 'Utilities/Object/error';

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
import ServicePreferenceInput from 'Settings/IndexerSettings/ServicePreferenceInput';

// CSS
import styles from './index.module.css';

// Types
import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { GCDownloadSource } from 'Helpers/Props/GCDownloadSources';
import type { InputChanged } from 'typings/Inputs';
import type { Indexer, IndexerClientType } from 'typings/Indexer';

type IndexerChanges = Pick<
    Indexer,
    | 'enabled'
    | 'title'
    | 'url'
    | 'gcServicePreference'
    | 'gcAvoidLargeDownloads'
>;

export interface EditIndexerModalContentProps {
    id?: number;
    downloadType?: DownloadType;
    clientType?: IndexerClientType;
    onModalClose: () => void;
    onDeleteIndexerPress?: () => void;
    onIndexersChange: () => void;
}

// IMPLEMENTATIONS

const defaultServicePreference = Object.values(
    GCDownloadSources,
) as GCDownloadSource[];

function getInitialChanges(
    indexer: Indexer | undefined,
    clientType: IndexerClientType,
): IndexerChanges {
    if (indexer) {
        return {
            enabled: indexer.enabled,
            title: indexer.title,
            url: indexer.url,
            gcServicePreference: indexer.gcServicePreference,
            gcAvoidLargeDownloads: indexer.gcAvoidLargeDownloads,
        };
    }

    return {
        enabled: true,
        title: clientType,
        url: '',
        gcServicePreference: defaultServicePreference,
        gcAvoidLargeDownloads: false,
    };
}

export default function EditIndexerModalContent({
    id,
    downloadType: initialDownloadType,
    clientType: initialClientType,
    onModalClose,
    onDeleteIndexerPress,
    onIndexersChange,
}: EditIndexerModalContentProps) {
    const { indexer, isFetching: isFetchingIndexer } = useGetIndexersQuery(
        undefined,
        {
            selectFromResult: ({ data, isFetching }) => ({
                indexer: data?.find((i) => i.id === id),
                isFetching,
            }),
        },
    );

    const { data: allOptions, isFetching: isFetchingOptions } =
        useGetIndexerOptionsQuery();

    const [
        testIndexer,
        {
            isLoading: isTesting,
            data: { description } = { description: undefined },
        },
    ] = useTestIndexerMutation();
    const [saveIndexer, { error: saveError }] = useSaveIndexerMutation();

    const downloadType = useMemo(
        () => initialDownloadType ?? indexer?.downloadType,
        [indexer, initialDownloadType],
    );

    const clientType = useMemo(
        () =>
            initialClientType ??
            indexer?.clientType ??
            ('' as IndexerClientType),
        [indexer, initialClientType],
    );

    const requiredTokens = useMemo(
        () =>
            indexer?.requiredTokens ??
            (downloadType
                ? allOptions?.[downloadType]?.[clientType]?.required_tokens
                : undefined) ??
            [],
        [allOptions, clientType, downloadType, indexer],
    );

    const isFetching = useMemo(
        () => isFetchingIndexer || isFetchingOptions,
        [isFetchingIndexer, isFetchingOptions],
    );

    const [isSaving, setIsSaving] = useState(false);

    const [changes, setChanges] = useState<IndexerChanges>(
        getInitialChanges(indexer, clientType),
    );

    const [prevIndexer, setPrevIndexer] = useState(indexer);
    const [prevClientType, setPrevClientType] = useState(clientType);
    if (indexer !== prevIndexer || clientType !== prevClientType) {
        setPrevIndexer(indexer);
        setPrevClientType(clientType);
        setChanges(getInitialChanges(indexer, clientType));
    }

    const handleInputChange = useCallback(
        <Key extends keyof IndexerChanges>({
            name,
            value,
        }: InputChanged<Key, IndexerChanges[Key]>) => {
            setChanges((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [],
    );

    const handleTestPress = useCallback(async () => {
        if (!downloadType) {
            return { data: undefined };
        }

        return await testIndexer({
            downloadType,
            clientType,
            url: changes.url,
        });
    }, [changes.url, clientType, downloadType, testIndexer]);

    const handleSavePress = useCallback(async () => {
        setIsSaving(true);

        const { data } = await handleTestPress();
        if (!data?.success) {
            setIsSaving(false);
            return;
        }

        const identifier =
            typeof id === 'number' ? { id } : { downloadType, clientType };

        const { error } = await saveIndexer({
            ...identifier,
            enabled: changes.enabled,
            title: changes.title,
            url: changes.url,
            gcServicePreference: requiredTokens.includes(
                'gc_service_preference',
            )
                ? changes.gcServicePreference
                : null,
            gcAvoidLargeDownloads: requiredTokens.includes(
                'gc_avoid_large_downloads',
            )
                ? changes.gcAvoidLargeDownloads
                : null,
        });
        setIsSaving(false);
        if (error) {
            return;
        }

        onIndexersChange();
        onModalClose();
    }, [
        changes,
        clientType,
        downloadType,
        handleTestPress,
        id,
        onIndexersChange,
        onModalClose,
        requiredTokens,
        saveIndexer,
    ]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {typeof id === 'number'
                    ? translate('EditIndexerImplementation', {
                          implementationName: clientType,
                      })
                    : translate('AddIndexerImplementation', {
                          implementationName: clientType,
                      })}
            </ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && saveError ? (
                    <Alert kind={kinds.DANGER}>
                        {getErrorMessage(saveError)}
                    </Alert>
                ) : null}

                {!isFetching ? (
                    <Form>
                        <FormGroup>
                            <FormLabel>{translate('Title')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="title"
                                onChange={handleInputChange}
                                value={changes.title}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('Enabled')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="enabled"
                                onChange={handleInputChange}
                                value={changes.enabled}
                            />
                        </FormGroup>

                        {requiredTokens.includes('url') ? (
                            <FormGroup>
                                <FormLabel>{translate('Url')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="url"
                                    onChange={handleInputChange}
                                    value={changes.url}
                                />
                            </FormGroup>
                        ) : null}

                        {requiredTokens.includes('gc_avoid_large_downloads') ? (
                            <FormGroup>
                                <FormLabel>
                                    {translate('AvoidLargeGetComicsDownloads')}
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.CHECK}
                                    name="gcAvoidLargeDownloads"
                                    helpText={translate(
                                        'AvoidLargeGetComicsDownloadsHelpText',
                                    )}
                                    onChange={handleInputChange}
                                    value={Boolean(
                                        changes.gcAvoidLargeDownloads,
                                    )}
                                />
                            </FormGroup>
                        ) : null}

                        {requiredTokens.includes('gc_service_preference') ? (
                            <FormGroup>
                                <FormLabel>
                                    {translate('ServicePreference')}
                                </FormLabel>

                                <ServicePreferenceInput
                                    value={
                                        changes.gcServicePreference ??
                                        defaultServicePreference
                                    }
                                    helpText={translate(
                                        'ServicePreferenceInfo',
                                    )}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        ) : null}
                    </Form>
                ) : null}
            </ModalBody>

            <ModalFooter>
                {typeof id === 'number' ? (
                    <Button
                        className={styles.deleteButton}
                        kind={kinds.DANGER}
                        onPress={onDeleteIndexerPress}
                    >
                        {translate('Delete')}
                    </Button>
                ) : null}

                <SpinnerErrorButton
                    isSpinning={isTesting}
                    error={description ? { message: description } : undefined}
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
