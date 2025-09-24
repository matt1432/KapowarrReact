// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useGetSettingsQuery } from 'Store/Api/Settings';
import { usePreviewConvertVolumeQuery, useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
import Alert from 'Components/Alert';
import CheckInput from 'Components/Form/CheckInput';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import ConvertPreviewRow from '../ConvertPreviewRow';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';

export interface ConvertPreviewModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function getValue(allSelected: boolean, allUnselected: boolean) {
    if (allSelected) {
        return true;
    }
    else if (allUnselected) {
        return false;
    }

    return null;
}

export default function ConvertPreviewModalContent({
    volumeId,
    onModalClose,
}: ConvertPreviewModalContentProps) {
    const [executeCommand] = useExecuteCommandMutation();

    const { folder } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                folder: data?.folder,
            }),
        },
    );

    const { items, isPreviewFetching, isPreviewPopulated, previewError } =
        usePreviewConvertVolumeQuery(
            { volumeId },
            {
                refetchOnMountOrArgChange: true,
                selectFromResult: ({ data, isFetching, isUninitialized, error }) => ({
                    items: data ?? [],
                    isPreviewFetching: isFetching,
                    isPreviewPopulated: !isUninitialized,
                    previewError: error,
                }),
            },
        );

    const { isFormatFetching, isFormatPopulated, formatError, format, convertFiles } =
        useGetSettingsQuery(undefined, {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({ data, error, isFetching, isUninitialized }) => ({
                isFormatFetching: isFetching,
                isFormatPopulated: !isUninitialized,
                formatError: error,
                format: String(data?.formatPreference),
                convertFiles: data?.convert,
            }),
        });

    const [{ allSelected, allUnselected, selectedState }, setSelectState] = useSelectState();

    const isFetching = isPreviewFetching || isFormatFetching;
    const isPopulated = isPreviewPopulated && isFormatPopulated;
    const error = previewError || formatError;

    const selectAllValue = getValue(allSelected, allUnselected);

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({ type: value ? 'selectAll' : 'unselectAll', items });
        },
        [items, setSelectState],
    );

    const handleSelectedChange = useCallback(
        ({ id, value, shiftKey = false }: SelectStateInputProps) => {
            setSelectState({
                type: 'toggleSelected',
                items,
                id,
                isSelected: value,
                shiftKey,
            });
        },
        [items, setSelectState],
    );

    const handleConvertPress = useCallback(() => {
        const issueIds = getSelectedIds(selectedState);

        executeCommand({
            cmd: commandNames.RENAME_VOLUME,
            volumeId,
            filepathFilter: items
                .filter(({ id }) => issueIds.includes(id))
                .map((i) => i.existingPath),
        });

        onModalClose();
    }, [executeCommand, items, onModalClose, selectedState, volumeId]);

    if (!folder) {
        return null;
    }

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('ConvertModalHeader')}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>{translate('ConvertLoadError')}</Alert>
                ) : null}

                {!isFetching && isPopulated && !items.length ? (
                    convertFiles ? (
                        <div>{translate('ConvertNothingToConvert')}</div>
                    ) : (
                        <div>{translate('ConvertDisabled')}</div>
                    )
                ) : null}

                {!isFetching && isPopulated && items.length ? (
                    <div>
                        <Alert>
                            <div>
                                <InlineMarkdown
                                    data={translate('ConvertRelativePaths', {
                                        path: folder,
                                    })}
                                    blockClassName={styles.path}
                                />
                            </div>

                            {format && (
                                <div>
                                    <InlineMarkdown
                                        data={translate('ConvertFormatPattern', { format })}
                                        blockClassName={styles.issueFormat}
                                    />
                                </div>
                            )}
                        </Alert>

                        <div className={styles.previews}>
                            {items.map((item) => {
                                return (
                                    <ConvertPreviewRow
                                        key={item.id}
                                        id={item.id}
                                        existingPath={item.existingPath.replace(folder + '/', '')}
                                        newPath={item.newPath.replace(folder + '/', '')}
                                        isSelected={selectedState[item.id]}
                                        onSelectedChange={handleSelectedChange}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                {isPopulated && items.length ? (
                    <CheckInput
                        className={styles.selectAllInput}
                        containerClassName={styles.selectAllInputContainer}
                        name="selectAll"
                        value={selectAllValue}
                        onChange={handleSelectAllChange}
                    />
                ) : null}

                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.PRIMARY} onPress={handleConvertPress} disabled={!items.length}>
                    {translate('Convert')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
