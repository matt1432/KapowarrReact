// TODO:
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

interface ProposalRowProps {
    id: number;
    proposal: ProposedImport & { id: number };
    columns: Column<ProposalColumnName>[];
    isSelected?: boolean;
    onSelectedChange: (props: SelectStateInputProps) => void;
}

// IMPLEMENTATIONS

export default function ProposalRow({
    id,
    proposal,
    columns,
    isSelected,
    onSelectedChange,
}: ProposalRowProps) {
    const [isChangeMatchModalOpen, setChangeMatchModalOpen, setChangeMatchModalClosed] =
        useModalOpenState(false);

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
                            <Link to={proposal.cv.link}>{proposal.cv.title}</Link>
                        </TableRowCell>
                    );
                }
                if (name === 'issueCount') {
                    return <TableRowCell>{proposal.cv.issueCount}</TableRowCell>;
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
            />
        </TableRow>
    );
}
