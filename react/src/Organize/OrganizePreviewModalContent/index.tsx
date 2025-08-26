// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useGetSettingsQuery } from 'Store/Api/Settings';
import { usePreviewRenameVolumeQuery } from 'Store/Api/Volumes';
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, kinds, specialVersions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

import useSelectState from 'Helpers/Hooks/useSelectState';
import useVolume from 'Volume/useVolume';

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
import OrganizePreviewRow from '../OrganizePreviewRow';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';

export interface OrganizePreviewModalContentProps {
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

export default function OrganizePreviewModalContent({
    volumeId,
    onModalClose,
}: OrganizePreviewModalContentProps) {
    const [executeCommand] = useExecuteCommandMutation();

    const { items, isPreviewFetching, isPreviewPopulated, previewError } =
        usePreviewRenameVolumeQuery(
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

    const { isNamingFetching, isNamingPopulated, namingError, naming } = useGetSettingsQuery(
        undefined,
        {
            selectFromResult: ({ data, error, isFetching, isUninitialized }) => ({
                isNamingFetching: isFetching,
                isNamingPopulated: !isUninitialized,
                namingError: error,
                naming: {
                    [`naming${specialVersions.NORMAL}`]: data?.fileNaming,
                    [`naming${specialVersions.VOL_AS_ISSUE}`]: data?.fileNamingVai,
                    [`naming${specialVersions.TPB}`]: data?.fileNamingSpecialVersion,
                    [`naming${specialVersions.ONE_SHOT}`]: data?.fileNamingSpecialVersion,
                    [`naming${specialVersions.HARD_COVER}`]: data?.fileNamingSpecialVersion,
                },
            }),
        },
    );

    const { volume } = useVolume(volumeId);
    const [{ allSelected, allUnselected, selectedState }, setSelectState] = useSelectState();

    const isFetching = isPreviewFetching || isNamingFetching;
    const isPopulated = isPreviewPopulated && isNamingPopulated;
    const error = previewError || namingError;

    const issueFormat =
        naming[`${volume?.specialVersion}IssueFormat`] ??
        naming[`naming${specialVersions.NORMAL}`] ??
        '';

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

    const handleOrganizePress = useCallback(() => {
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

    if (!volume) {
        return null;
    }

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OrganizeModalHeader')}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>{translate('OrganizeLoadError')}</Alert>
                ) : null}

                {!isFetching && isPopulated && !items.length ? (
                    <div>
                        <div>{translate('OrganizeNothingToRename')}</div>
                    </div>
                ) : null}

                {!isFetching && isPopulated && items.length ? (
                    <div>
                        <Alert>
                            <div>
                                <InlineMarkdown
                                    data={translate('OrganizeRelativePaths', {
                                        path: volume.folder,
                                    })}
                                    blockClassName={styles.path}
                                />
                            </div>

                            <div>
                                <InlineMarkdown
                                    data={translate('OrganizeNamingPattern', { issueFormat })}
                                    blockClassName={styles.issueFormat}
                                />
                            </div>
                        </Alert>

                        <div className={styles.previews}>
                            {items.map((item) => {
                                return (
                                    <OrganizePreviewRow
                                        key={item.id}
                                        id={item.id}
                                        existingPath={item.existingPath.replace(
                                            volume.folder + '/',
                                            '',
                                        )}
                                        newPath={item.newPath.replace(volume.folder + '/', '')}
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

                <Button kind={kinds.PRIMARY} onPress={handleOrganizePress}>
                    {translate('Organize')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
