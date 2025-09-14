// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import CheckInput from 'Components/Form/CheckInput';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components
import ChangeMatchModal from '../ChangeMatch/ChangeMatchModal';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged, SelectStateInputProps } from 'typings/Inputs';
import type { ProposedImport } from 'typings/Search';
import type { Column } from 'Components/Table/Column';
import type { ProposalColumnName } from '..';
import type { VolumeMetadata } from 'AddVolume/AddVolume';

interface ProposalRowProps {
    id: number;
    proposal: ProposedImport & { id: number };
    currentMatch: ProposedImport['cv'];
    columns: Column<ProposalColumnName>[];
    isSelected?: boolean;
    onSelectedChange: (props: SelectStateInputProps) => void;
    onEditMatch: (newValues: { filepath: string; id: number }, match: ProposedImport['cv']) => void;
    onEditGroupMatch: (
        newValues: { filepath: string; id: number },
        match: ProposedImport['cv'],
    ) => void;
}

// IMPLEMENTATIONS

export default function ProposalRow({
    id,
    proposal,
    currentMatch,
    columns,
    isSelected,
    onSelectedChange,
    onEditMatch,
    onEditGroupMatch,
}: ProposalRowProps) {
    const [isChangeMatchModalOpen, setChangeMatchModalOpen, setChangeMatchModalClosed] =
        useModalOpenState(false);

    const handleEditMatch = useCallback(
        (isGroup: boolean) => (match: VolumeMetadata) => {
            const edit = isGroup ? onEditGroupMatch : onEditMatch;
            edit(
                {
                    filepath: proposal.filepath,
                    id: match.comicvineId,
                },
                {
                    id: match.comicvineId,
                    title: match.title,
                    issueCount: match.issueCount,
                    link: match.siteUrl,
                },
            );
            setChangeMatchModalClosed();
        },
        [onEditMatch, onEditGroupMatch, proposal.filepath, setChangeMatchModalClosed],
    );

    const handleSelectedChange = useCallback(
        ({ value, shiftKey }: CheckInputChanged<string>) => {
            onSelectedChange({ id, value, shiftKey });
        },
        [id, onSelectedChange],
    );

    useEffect(() => {
        onSelectedChange({ id, value: true, shiftKey: false });
    }, [id, onSelectedChange]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'selected') {
                    return (
                        <TableRowCell>
                            <CheckInput
                                className={styles.selectedInput}
                                containerClassName={styles.selectedContainer}
                                name={id.toString()}
                                value={isSelected}
                                onChange={handleSelectedChange}
                            />
                        </TableRowCell>
                    );
                }
                if (name === 'file') {
                    return (
                        <TableRowCell title={proposal.fileTitle}>{proposal.filepath}</TableRowCell>
                    );
                }
                if (name === 'cvLink') {
                    return (
                        <TableRowCell>
                            <Link to={currentMatch.link}>{currentMatch.title}</Link>
                        </TableRowCell>
                    );
                }
                if (name === 'issueCount') {
                    return <TableRowCell>{currentMatch.issueCount}</TableRowCell>;
                }
                if (name === 'actions') {
                    return (
                        <TableRowCell>
                            <IconButton
                                title={translate('ChangeMatch')}
                                name={icons.EDIT}
                                onPress={setChangeMatchModalOpen}
                            />
                        </TableRowCell>
                    );
                }
            })}

            <ChangeMatchModal
                isOpen={isChangeMatchModalOpen}
                onModalClose={setChangeMatchModalClosed}
                proposal={proposal}
                onEditMatch={handleEditMatch(false)}
                onEditGroupMatch={handleEditMatch(true)}
            />
        </TableRow>
    );
}
