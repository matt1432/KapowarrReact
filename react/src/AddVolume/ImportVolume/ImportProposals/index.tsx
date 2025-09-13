// TODO:
// IMPORTS

// React
import { useCallback } from 'react';

// Redux

// Misc

// Hooks
import useSelectState from 'Helpers/Hooks/useSelectState';

// General Components
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
import translate from 'Utilities/String/translate';

export type ProposalColumnName = 'selected' | 'file' | 'cvLink' | 'issueCount' | 'changeMatch';

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

export default function ImportProposals({ proposals }: ImportProposalsProps) {
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
            label: () => translate('CVLink'),
            isVisible: true,
        },
        {
            name: 'issueCount',
            label: () => translate('IssueCount'),
            isVisible: true,
        },
        {
            name: 'changeMatch',
            label: () => translate('ChangeMatch'),
            isVisible: true,
        },
    ];

    return (
        <Table columns={columns}>
            <TableBody>
                {proposals.map((proposal) => (
                    <ProposalRow
                        key={proposal.id}
                        id={proposal.id}
                        columns={columns}
                        proposal={proposal}
                        isSelected={selectedState[proposal.id]}
                        onSelectedChange={handleSelectedChange}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
