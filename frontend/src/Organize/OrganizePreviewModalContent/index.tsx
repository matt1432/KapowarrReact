// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { getVolumeStatus } from 'Store/Slices/SocketEvents';

import { useGetSettingsQuery } from 'Store/Api/Settings';
import {
    usePreviewRenameVolumeQuery,
    useSearchVolumeQuery,
} from 'Store/Api/Volumes';
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, kinds, specialVersions } from 'Helpers/Props';

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
    const { isRenaming } = useRootSelector((state) =>
        getVolumeStatus(state, volumeId),
    );

    const [executeCommand] = useExecuteCommandMutation();

    const { folder, specialVersion } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                folder: data?.folder,
                specialVersion: data?.specialVersion,
            }),
        },
    );

    const { items, isPreviewFetching, isPreviewPopulated, previewError } =
        usePreviewRenameVolumeQuery(
            { volumeId },
            {
                refetchOnMountOrArgChange: true,
                selectFromResult: ({
                    data,
                    isFetching,
                    isUninitialized,
                    error,
                }) => ({
                    items: data ?? [],
                    isPreviewFetching: isFetching,
                    isPreviewPopulated: !isUninitialized,
                    previewError: error,
                }),
            },
        );

    const { isNamingFetching, isNamingPopulated, namingError, naming } =
        useGetSettingsQuery(undefined, {
            selectFromResult: ({
                data,
                error,
                isFetching,
                isUninitialized,
            }) => ({
                isNamingFetching: isFetching,
                isNamingPopulated: !isUninitialized,
                namingError: error,
                naming: {
                    [`naming${specialVersions.NORMAL}`]: data?.fileNaming,
                    [`naming${specialVersions.VOL_AS_ISSUE}`]:
                        data?.fileNamingVai,
                    [`naming${specialVersions.TPB}`]:
                        data?.fileNamingSpecialVersion,
                    [`naming${specialVersions.ONE_SHOT}`]:
                        data?.fileNamingSpecialVersion,
                    [`naming${specialVersions.HARD_COVER}`]:
                        data?.fileNamingSpecialVersion,
                },
            }),
        });

    const newFolder = useMemo(() => {
        if (items.length === 0) {
            return undefined;
        }
        return items[0].newPath.replace(
            '/' + items[0].newPath.split('/').at(-1)!,
            '',
        );
    }, [items]);

    const isRenamingFolder = useMemo(() => {
        if (items.length === 0) {
            return false;
        }
        return folder !== newFolder;
    }, [folder, items.length, newFolder]);

    const [{ allSelected, allUnselected, selectedState }, setSelectState] =
        useSelectState();

    const isFetching = useMemo(
        () => isPreviewFetching || isNamingFetching,
        [isPreviewFetching, isNamingFetching],
    );

    const isPopulated = useMemo(
        () => isPreviewPopulated && isNamingPopulated,
        [isNamingPopulated, isPreviewPopulated],
    );

    const error = useMemo(
        () => previewError || namingError,
        [namingError, previewError],
    );

    const issueFormat = useMemo(
        () =>
            naming[`${specialVersion}IssueFormat`] ??
            naming[`naming${specialVersions.NORMAL}`] ??
            '',
        [naming, specialVersion],
    );

    const selectAllValue = getValue(allSelected, allUnselected);

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({
                type: value ? 'selectAll' : 'unselectAll',
                items,
            });
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

    if (!folder) {
        return null;
    }

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OrganizeModalHeader')}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>
                        {translate('OrganizeLoadError')}
                    </Alert>
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
                                {isRenamingFolder ? (
                                    <>
                                        <InlineMarkdown
                                            data={translate(
                                                'OrganizeRenamingFolder',
                                            )}
                                            blockClassName={styles.path}
                                        />
                                        <div className={styles.folderRename}>
                                            <OrganizePreviewRow
                                                existingPath={folder}
                                                newPath={newFolder ?? ''}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <InlineMarkdown
                                        data={translate(
                                            'OrganizeRelativePaths',
                                            {
                                                path: folder,
                                            },
                                        )}
                                        blockClassName={styles.path}
                                    />
                                )}
                            </div>

                            <br />

                            <div>
                                <InlineMarkdown
                                    data={translate('OrganizeNamingPattern', {
                                        issueFormat,
                                    })}
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
                                        existingPath={
                                            item.existingPath.split('/').at(-1)!
                                        }
                                        newPath={
                                            item.newPath.split('/').at(-1)!
                                        }
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

                <Button
                    kind={kinds.PRIMARY}
                    onPress={handleOrganizePress}
                    disabled={isRenaming}
                >
                    {translate('Organize')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
