// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

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
    columns: Column<ProposalColumnName>[];
    isSelected?: boolean;
    onSelectedChange: (props: SelectStateInputProps) => void;
    onEditMatch: (newValues: { filepath: string; id: number }) => void;
}

// IMPLEMENTATIONS

export default function ProposalRow({
    id,
    proposal,
    columns,
    isSelected,
    onSelectedChange,
    onEditMatch,
}: ProposalRowProps) {
    const [cvLink, setCvLink] = useState(proposal.cv.link);
    const [cvTitle, setCvTitle] = useState(proposal.cv.title);
    const [cvIssueCount, setCvIssueCount] = useState(proposal.cv.issueCount);

    useEffect(() => {
        setCvLink(proposal.cv.link);
        setCvTitle(proposal.cv.title);
        setCvIssueCount(proposal.cv.issueCount);
    }, [proposal.cv]);

    const [isChangeMatchModalOpen, setChangeMatchModalOpen, setChangeMatchModalClosed] =
        useModalOpenState(false);

    const handleEditMatch = useCallback(
        (match: VolumeMetadata) => {
            setCvLink(match.siteUrl);
            setCvTitle(match.title);
            setCvIssueCount(match.issueCount);

            onEditMatch({
                filepath: proposal.filepath,
                id: match.comicvineId,
            });
        },
        [onEditMatch, proposal.filepath],
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
                            <Link to={cvLink}>{cvTitle}</Link>
                        </TableRowCell>
                    );
                }
                if (name === 'issueCount') {
                    return <TableRowCell>{cvIssueCount}</TableRowCell>;
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
                onEditMatch={handleEditMatch}
            />
        </TableRow>
    );
}
