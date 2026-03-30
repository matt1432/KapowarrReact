// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import {
    useGetFilesMatchingQuery,
    useSetFilesMatchingMutation,
} from 'Store/Api/Volumes';

// Misc
import { without } from 'lodash';

import { getErrorMessage } from 'Utilities/Object/error';
import { align, icons, kinds, scrollDirections } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
import SelectInput from 'Components/Form/SelectInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import SelectedMenuItem from 'Components/Menu/SelectedMenuItem';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import SelectIssueModal from 'InteractiveImport/Issue/SelectIssueModal';
import SelectStringValueModal from 'InteractiveImport/SelectStringValue/SelectStringValueModal';
import InteractiveImportRow from './InteractiveImportRow';

// CSS
import styles from './InteractiveImportModalContent.module.css';

// Types
import type { SelectInputOption } from 'Components/Form/SelectInput';
import type { SelectedIssue } from 'InteractiveImport/Issue/SelectIssueModalContent';
import type {
    FileMatch,
    SelectType,
} from 'InteractiveImport/InteractiveImport';
import type { CheckInputChanged } from 'typings/Inputs';
import type { InteractiveImportRowProps } from './InteractiveImportRow';

const OPTIONS: SelectInputOption[] = [
    {
        key: 'select',
        value: translate('SelectDropdown'),
        disabled: true,
    },
    {
        key: 'issueIds',
        value: translate('SelectIssues'),
    },
    {
        key: 'releaser',
        value: translate('SelectReleaseGroup'),
    },
    {
        key: 'scanType',
        value: translate('SelectScanType'),
    },
    {
        key: 'resolution',
        value: translate('SelectResolution'),
    },
    {
        key: 'dpi',
        value: translate('SelectDpi'),
    },
    {
        key: 'notes',
        value: translate('SelectNotes'),
    },
];

export interface InteractiveImportModalContentProps {
    volumeId: number;
    title?: string;
    folder?: string;
    modalTitle: string;
    onModalClose(): void;
}

export default function InteractiveImportModalContent({
    volumeId,
    title,
    folder,
    modalTitle,
    onModalClose,
}: InteractiveImportModalContentProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.interactiveImport,
    );

    const [setFilesMatching] = useSetFilesMatchingMutation();

    const { data, isPopulated, error, isFetching } = useGetFilesMatchingQuery(
        { volumeId },
        {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({
                data,
                isFetching,
                isUninitialized,
                error,
            }) => ({
                data: data ?? [],
                isFetching,
                isPopulated: !isUninitialized,
                error,
            }),
        },
    );

    const [_items, setItems] = useState(data);
    useEffect(() => {
        setItems(data);
    }, [data]);

    const [filterExistingFiles, setFilterExistingFiles] = useState(false);

    const items = useMemo(
        () =>
            filterExistingFiles
                ? _items.filter((item) => item.fileId === null)
                : _items,
        [_items, filterExistingFiles],
    );

    const [invalidRowsSelected, setInvalidRowsSelected] = useState<number[]>(
        [],
    );
    const [withoutIssueFileIdRowsSelected, setWithoutIssueFileIdRowsSelected] =
        useState<number[]>([]);
    const [selectModalOpen, setSelectModalOpen] = useState<SelectType | null>(
        null,
    );
    const [{ allSelected, allUnselected, selectedState }, setSelectState] =
        useSelectState();

    const selectedIds: number[] = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const onSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({
                type: value ? 'selectAll' : 'unselectAll',
                items,
            });
        },
        [items, setSelectState],
    );

    const onSelectedChange = useCallback<
        InteractiveImportRowProps['onSelectedChange']
    >(
        ({ id, value, hasIssueFileId, shiftKey = false }) => {
            setSelectState({
                type: 'toggleSelected',
                items,
                id,
                isSelected: value,
                shiftKey,
            });

            setWithoutIssueFileIdRowsSelected(
                hasIssueFileId || !value
                    ? without(withoutIssueFileIdRowsSelected, id as number)
                    : [...withoutIssueFileIdRowsSelected, id as number],
            );
        },
        [
            items,
            withoutIssueFileIdRowsSelected,
            setSelectState,
            setWithoutIssueFileIdRowsSelected,
        ],
    );

    const onValidRowChange = useCallback(
        (id: number, isValid: boolean) => {
            if (isValid && invalidRowsSelected.includes(id)) {
                setInvalidRowsSelected(without(invalidRowsSelected, id));
            }
            else if (!isValid && !invalidRowsSelected.includes(id)) {
                setInvalidRowsSelected([...invalidRowsSelected, id]);
            }
        },
        [invalidRowsSelected, setInvalidRowsSelected],
    );

    const onImportSelectedPress = useCallback(() => {
        const fileMatches = items.filter(
            (item) => selectedIds.indexOf(item.id) > -1,
        );

        const changes = fileMatches.filter((item) => {
            const originalItem = data.find((og) => og.id === item.id);
            if (!originalItem) {
                return false;
            }
            return JSON.stringify(item) !== JSON.stringify(originalItem);
        });

        if (changes.length) {
            setFilesMatching({ volumeId, fileMatches: changes });

            onModalClose();
        }
    }, [data, items, selectedIds, onModalClose, setFilesMatching, volumeId]);

    const onFilterExistingFilesChange = useCallback(
        (value: string | undefined) => {
            setFilterExistingFiles(value !== 'all');
        },
        [],
    );

    const onSelectModalSelect = useCallback<
        ({ value }: { value: SelectType }) => void
    >(
        ({ value }) => {
            setSelectModalOpen(value);
        },
        [setSelectModalOpen],
    );

    const onSelectModalClose = useCallback(() => {
        setSelectModalOpen(null);
    }, [setSelectModalOpen]);

    const setFileMatchValue = useCallback(
        <K extends keyof FileMatch, V extends FileMatch[K]>(
            id: number,
            key: K,
            value: V,
        ) => {
            const newItems = structuredClone(_items);

            const thisItemIndex = _items.findIndex((item) => item.id === id);
            const thisItem = _items[thisItemIndex];
            const newItem: FileMatch = {
                ...thisItem,
                [key]: value,
            };

            newItems.splice(thisItemIndex, 1, newItem);

            setItems(newItems);
        },
        [_items],
    );

    const onIssuesSelect = useCallback(
        (selectedIssues: SelectedIssue[]) => {
            const newItems = structuredClone(_items);

            selectedIssues.forEach((selectedIssue) => {
                const { id, issues } = selectedIssue;

                const thisItemIndex = _items.findIndex(
                    (item) => item.id === id,
                );
                const thisItem = _items[thisItemIndex];
                const newItem: FileMatch = {
                    ...thisItem,
                    issueIds: issues.map((issue) => issue.id),
                };

                newItems.splice(thisItemIndex, 1, newItem);
            });

            setItems(newItems);
            setSelectModalOpen(null);
        },
        [_items],
    );

    const onValueSelect = useCallback(
        <K extends keyof FileMatch, V extends FileMatch[K]>(key: K) =>
            (value: V) => {
                const newItems = structuredClone(_items);

                _items
                    .filter((item) => selectedIds.indexOf(item.id) > -1)
                    .forEach((item) => {
                        const thisItemIndex = _items.findIndex(
                            (otherItem) => item.id === otherItem.id,
                        );
                        const thisItem = _items[thisItemIndex];
                        const newItem: FileMatch = {
                            ...thisItem,
                            [key]: value,
                        };

                        newItems.splice(thisItemIndex, 1, newItem);
                    });

                setItems(newItems);
                setSelectModalOpen(null);
            },
        [_items, selectedIds],
    );

    const orderedSelectedIds = items.reduce((acc: number[], file) => {
        if (selectedIds.includes(file.id)) {
            acc.push(file.id);
        }

        return acc;
    }, []);

    const errorMessage = getErrorMessage(
        error,
        translate('InteractiveImportLoadError'),
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {modalTitle} - {title || folder}
            </ModalHeader>

            <ModalBody scrollDirection={scrollDirections.BOTH}>
                <div className={styles.filterContainer}>
                    <Menu alignMenu={align.RIGHT}>
                        <MenuButton>
                            <Icon name={icons.FILTER} size={22} />

                            <div className={styles.filterText}>
                                {filterExistingFiles
                                    ? translate('UnmappedFilesOnly')
                                    : translate('AllFiles')}
                            </div>
                        </MenuButton>

                        <MenuContent>
                            <SelectedMenuItem
                                name="all"
                                isSelected={!filterExistingFiles}
                                onPress={onFilterExistingFilesChange}
                            >
                                {translate('AllFiles')}
                            </SelectedMenuItem>

                            <SelectedMenuItem
                                name="new"
                                isSelected={filterExistingFiles}
                                onPress={onFilterExistingFilesChange}
                            >
                                {translate('UnmappedFilesOnly')}
                            </SelectedMenuItem>
                        </MenuContent>
                    </Menu>
                </div>

                {isFetching ? <LoadingIndicator /> : null}

                {error ? <div>{errorMessage}</div> : null}

                {isPopulated && !!items.length && !isFetching ? (
                    <SortedTable
                        tableName="interactiveImport"
                        columns={columns}
                        items={items}
                        itemRenderer={(item) => (
                            <InteractiveImportRow
                                key={item.id}
                                isSelected={selectedState[item.id]}
                                volumeId={volumeId}
                                {...item}
                                columns={columns}
                                modalTitle={modalTitle}
                                onSelectedChange={onSelectedChange}
                                onValidRowChange={onValidRowChange}
                                setFileMatchValue={setFileMatchValue}
                            />
                        )}
                        tableProps={{
                            horizontalScroll: true,
                            selectAll: true,
                            allSelected,
                            allUnselected,
                            onSelectAllChange,
                        }}
                    />
                ) : null}

                {isPopulated && !items.length && !isFetching
                    ? translate('InteractiveImportNoFilesFound')
                    : null}
            </ModalBody>

            <ModalFooter className={styles.footer}>
                <div className={styles.leftButtons}>
                    <SelectInput
                        className={styles.bulkSelect}
                        name="select"
                        value="select"
                        values={OPTIONS}
                        isDisabled={!selectedIds.length}
                        onChange={onSelectModalSelect}
                    />
                </div>

                <div className={styles.rightButtons}>
                    <Button onPress={onModalClose}>Cancel</Button>

                    <Button
                        kind={kinds.SUCCESS}
                        isDisabled={
                            !selectedIds.length || !!invalidRowsSelected.length
                        }
                        onPress={onImportSelectedPress}
                    >
                        {translate('Import')}
                    </Button>
                </div>
            </ModalFooter>

            <SelectIssueModal
                isOpen={selectModalOpen === 'issueIds'}
                selectedIds={orderedSelectedIds}
                volumeId={volumeId}
                modalTitle={modalTitle}
                onIssuesSelect={onIssuesSelect}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'releaser'}
                initialValue=""
                valueTitleKey="ReleaseGroup"
                modalTitleKey="SetReleaseGroupModalTitle"
                confirmKey="SetReleaseGroup"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('releaser')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'resolution'}
                initialValue=""
                valueTitleKey="Resolution"
                modalTitleKey="SetResolutionModalTitle"
                confirmKey="SetResolution"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('resolution')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'dpi'}
                initialValue=""
                valueTitleKey="DPI"
                modalTitleKey="SetDpiModalTitle"
                confirmKey="SetDpi"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('dpi')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'scanType'}
                initialValue=""
                valueTitleKey="ScanType"
                modalTitleKey="SetScanTypeModalTitle"
                confirmKey="SetScanType"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('scanType')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'notes'}
                initialValue=""
                valueTitleKey="Notes"
                modalTitleKey="SetNotesModalTitle"
                confirmKey="SetNotes"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('notes')}
                onModalClose={onSelectModalClose}
            />
        </ModalContent>
    );
}
