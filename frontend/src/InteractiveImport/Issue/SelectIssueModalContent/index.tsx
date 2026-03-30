// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import { kinds, scrollDirections } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import getSelectedIds from 'Utilities/Table/getSelectedIds';
import translate from 'Utilities/String/translate';

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Scroller from 'Components/Scroller/Scroller';
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import SelectIssueRow from '../SelectIssueRow';

// CSS
import styles from './index.module.css';

// Types
import type { Issue } from 'Issue/Issue';
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';

export interface SelectedIssue {
    id: number;
    issues: Issue[];
}

interface SelectIssueModalContentProps {
    selectedIds: number[] | string[];
    modalTitle: string;
    volumeId: number;
    onIssuesSelect(selectedIssues: SelectedIssue[]): void;
    onModalClose(): void;
}

export default function SelectIssueModalContent({
    selectedIds,
    modalTitle,
    volumeId,
    onIssuesSelect,
    onModalClose,
}: SelectIssueModalContentProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.selectIssue,
    );

    const { items, isFetching, isUninitialized, error } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({
                data,
                isFetching,
                isUninitialized,
                error,
            }) => ({
                items: data?.issues ?? [],
                isFetching,
                isUninitialized,
                error,
            }),
        },
    );

    const [{ allSelected, allUnselected, selectedState }, setSelectState] =
        useSelectState();

    const errorMessage = getErrorMessage(error, translate('IssuesLoadError'));
    const selectedCount = selectedIds.length;
    const selectedIssuesCount = getSelectedIds(selectedState).length;
    const selectionIsValid =
        selectedIssuesCount > 0 && selectedIssuesCount % selectedCount === 0;

    const onSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({
                type: value ? 'selectAll' : 'unselectAll',
                items,
            });
        },
        [items, setSelectState],
    );

    const onSelectedChange = useCallback(
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

    const onIssuesSelectWrapper = useCallback(() => {
        const issueIds: number[] = getSelectedIds(selectedState);

        const selectedIssues = items.reduce((acc: Issue[], item) => {
            if (issueIds.indexOf(item.id) > -1) {
                acc.push(item);
            }

            return acc;
        }, []);

        const issuesPerFile = selectedIssues.length / selectedIds.length;

        const mappedIssues = selectedIds.map((id, index): SelectedIssue => {
            const startingIndex = index * issuesPerFile;
            const issues = selectedIssues.slice(
                startingIndex,
                startingIndex + issuesPerFile,
            );

            return {
                id: id as number,
                issues,
            };
        });

        onIssuesSelect(mappedIssues);
    }, [selectedIds, items, selectedState, onIssuesSelect]);

    const details =
        selectedCount > 1
            ? translate('CountSelectedFiles', { selectedCount })
            : translate('CountSelectedFile', { selectedCount });

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('SelectIssuesModalTitle', { modalTitle })}
            </ModalHeader>

            <ModalBody
                className={styles.modalBody}
                scrollDirection={scrollDirections.NONE}
            >
                <Scroller className={styles.scroller} autoFocus={false}>
                    {isFetching ? <LoadingIndicator /> : null}

                    {error ? <div>{errorMessage}</div> : null}

                    {!isUninitialized && !!items.length ? (
                        <SortedTable
                            tableName="selectIssue"
                            columns={columns}
                            items={items}
                            itemRenderer={(item) => {
                                return (
                                    <SelectIssueRow
                                        key={item.id}
                                        id={item.id}
                                        issueNumber={item.calculatedIssueNumber}
                                        title={item.title ?? ''}
                                        columns={columns}
                                        isSelected={selectedState[item.id]}
                                        onSelectedChange={onSelectedChange}
                                    />
                                );
                            }}
                            tableProps={{
                                selectAll: true,
                                allSelected,
                                allUnselected,
                                onSelectAllChange,
                            }}
                            predicates={{
                                issueNumber: (a, b) =>
                                    a.calculatedIssueNumber -
                                    b.calculatedIssueNumber,
                            }}
                        />
                    ) : null}

                    {!isUninitialized && !items.length
                        ? translate('NoMatchFound')
                        : null}
                </Scroller>
            </ModalBody>

            <ModalFooter className={styles.footer}>
                <div className={styles.details}>{details}</div>

                <div className={styles.buttons}>
                    <Button onPress={onModalClose}>
                        {translate('Cancel')}
                    </Button>

                    <Button
                        kind={kinds.SUCCESS}
                        isDisabled={!selectionIsValid}
                        onPress={onIssuesSelectWrapper}
                    >
                        {translate('SelectIssues')}
                    </Button>
                </div>
            </ModalFooter>
        </ModalContent>
    );
}
