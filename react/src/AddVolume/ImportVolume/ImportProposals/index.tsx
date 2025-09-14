// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useImportLibraryMutation } from 'Store/Api/Volumes';

// Misc
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import translate from 'Utilities/String/translate';

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
import Button from 'Components/Link/Button';
import CheckInput from 'Components/Form/CheckInput';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import ProposalRow from './ProposalRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { ProposedImport } from 'typings/Search';
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';

export type ProposalColumnName = 'selected' | 'file' | 'cvLink' | 'issueCount' | 'actions';

interface ImportProposalsProps {
    proposals: (ProposedImport & { id: number })[];
    returnToSearchPage: () => void;
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

export default function ImportProposals({ proposals, returnToSearchPage }: ImportProposalsProps) {
    // SELECTION
    const [{ allSelected, allUnselected, selectedState }, setSelectState] = useSelectState();

    const selectAllValue = getValue(allSelected, allUnselected);

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({ type: value ? 'selectAll' : 'unselectAll', items: proposals });
        },
        [proposals, setSelectState],
    );

    const handleSelectedChange = useCallback(
        ({ id, value, shiftKey = false }: SelectStateInputProps) => {
            setSelectState({
                type: 'toggleSelected',
                items: proposals,
                id,
                isSelected: value,
                shiftKey,
            });
        },
        [proposals, setSelectState],
    );

    // IMPORTING
    const [idToFilepath, setIdToFilepath] = useState<{ filepath: string; id: number }[]>(
        proposals.map((item) => ({
            filepath: item.filepath,
            id: item.cv.id,
        })),
    );
    useEffect(() => {
        setIdToFilepath(
            proposals.map((item) => ({
                filepath: item.filepath,
                id: item.cv.id,
            })),
        );
    }, [proposals]);
    const handleEditMatch = useCallback(
        (id: number) => (newValues: { filepath: string; id: number }) => {
            const tempArr = [...idToFilepath];
            tempArr[id] = newValues;
            setIdToFilepath(tempArr);
        },
        [idToFilepath],
    );

    const [importLibrary] = useImportLibraryMutation();

    const handleImportLibrary = useCallback(
        (renameFiles: boolean) => () => {
            importLibrary({
                renameFiles,
                body: getSelectedIds(selectedState)
                    .filter((id) => id !== null)
                    .map((id) => idToFilepath[id]),
            });
        },
        [idToFilepath, importLibrary, selectedState],
    );

    // COLUMNS
    const columns: Column<ProposalColumnName>[] = [
        {
            name: 'selected',
            label: proposals.length ? (
                <CheckInput
                    className={styles.selectAllInput}
                    containerClassName={styles.selectAllInputContainer}
                    name="selectAll"
                    value={selectAllValue}
                    onChange={handleSelectAllChange}
                />
            ) : null,
            isVisible: true,
        },
        {
            name: 'file',
            label: () => translate('File'),
            isVisible: true,
        },
        {
            name: 'cvLink',
            label: () => translate('Match'),
            isVisible: true,
        },
        {
            name: 'issueCount',
            label: () => translate('IssueCount'),
            isVisible: true,
        },
        {
            name: 'actions',
            label: '',
            isVisible: true,
        },
    ];

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button onPress={returnToSearchPage}>{translate('Cancel')}</Button>

                <Button onPress={handleImportLibrary(false)}>{translate('Import')}</Button>

                <Button onPress={handleImportLibrary(true)}>{translate('ImportRename')}</Button>
            </div>

            <Table columns={columns}>
                <TableBody>
                    {proposals.map((proposal) => (
                        <ProposalRow
                            key={proposal.id}
                            id={proposal.id}
                            columns={columns}
                            proposal={proposal}
                            onEditMatch={handleEditMatch(proposal.id)}
                            isSelected={selectedState[proposal.id]}
                            onSelectedChange={handleSelectedChange}
                        />
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
