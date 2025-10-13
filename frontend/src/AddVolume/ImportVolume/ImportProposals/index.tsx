// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useImportLibraryMutation } from 'Store/Api/Volumes';

// Misc
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import translate from 'Utilities/String/translate';

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
import Button from 'Components/Link/Button';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import ProposalRow from './ProposalRow';

// CSS
import styles from './index.module.css';

// Types
import type { ProposedImport } from 'typings/Search';
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';

interface ImportProposalsProps {
    proposals: (ProposedImport & { id: number })[];
    returnToSearchPage: () => void;
}

// IMPLEMENTATIONS

export default function ImportProposals({
    proposals,
    returnToSearchPage,
}: ImportProposalsProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.importProposals,
    );

    // SELECTION
    const [{ allSelected, allUnselected, selectedState }, setSelectState] =
        useSelectState();

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelectState({
                type: value ? 'selectAll' : 'unselectAll',
                items: proposals,
            });
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
    const [currentMatches, setCurrentMatches] = useState<
        {
            match: ProposedImport['cv'];
            body: { filepath: string; id: number };
        }[]
    >(
        proposals.map((item) => ({
            match: item.cv,
            body: {
                filepath: item.filepath,
                id: item.cv.id,
            },
        })),
    );

    const [prevProposals, setPrevProposals] = useState(proposals);
    if (proposals !== prevProposals) {
        setPrevProposals(proposals);
        setCurrentMatches(
            proposals.map((item) => ({
                match: item.cv,
                body: {
                    filepath: item.filepath,
                    id: item.cv.id,
                },
            })),
        );
    }

    const handleEditMatch = useCallback(
        (id: number) =>
            (
                newValues: { filepath: string; id: number },
                match: ProposedImport['cv'],
            ) => {
                const tempArr = [...currentMatches];
                tempArr[id] = {
                    match,
                    body: newValues,
                };
                setCurrentMatches(tempArr);
            },
        [currentMatches],
    );

    const handleEditGroupMatch = useCallback(
        (group: number) =>
            (
                newValues: { filepath: string; id: number },
                match: ProposedImport['cv'],
            ) => {
                const groupIds = proposals
                    .filter((proposal) => proposal.groupNumber === group)
                    .map((p) => p.id);

                const tempArr = [...currentMatches];

                for (const id of groupIds) {
                    tempArr[id] = {
                        match,
                        body: {
                            filepath: proposals[id].filepath,
                            id: newValues.id,
                        },
                    };
                }
                setCurrentMatches(tempArr);
            },
        [currentMatches, proposals],
    );

    const [importLibrary] = useImportLibraryMutation();

    const handleImportLibrary = useCallback(
        (renameFiles: boolean) => () => {
            importLibrary({
                renameFiles,
                body: getSelectedIds(selectedState)
                    .filter((id) => id !== null)
                    .map((id) => currentMatches[id].body),
            });
        },
        [currentMatches, importLibrary, selectedState],
    );

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button onPress={returnToSearchPage}>
                    {translate('Cancel')}
                </Button>

                <Button
                    title="Add volumes, set volume folder to the folder that the files are in, don't rename the volume folder, don't rename the files."
                    onPress={handleImportLibrary(false)}
                >
                    {translate('Import')}
                </Button>

                <Button
                    title="Add volumes, move files into automatically generated volume folder (named following the settings), rename files."
                    onPress={handleImportLibrary(true)}
                >
                    {translate('ImportRename')}
                </Button>
            </div>

            <Table
                tableName="importProposals"
                columns={columns}
                selectAll
                allSelected={allSelected}
                allUnselected={allUnselected}
                onSelectAllChange={handleSelectAllChange}
            >
                <TableBody>
                    {proposals.map((proposal) => (
                        <ProposalRow
                            key={proposal.id}
                            id={proposal.id}
                            columns={columns}
                            proposal={proposal}
                            currentMatch={currentMatches[proposal.id].match}
                            onEditMatch={handleEditMatch(proposal.id)}
                            onEditGroupMatch={handleEditGroupMatch(
                                proposal.groupNumber,
                            )}
                            isSelected={selectedState[proposal.id]}
                            onSelectedChange={handleSelectedChange}
                        />
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
