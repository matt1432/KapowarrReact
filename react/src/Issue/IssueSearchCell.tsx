// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useExecuteCommandMutation } from 'Store/createApiEndpoints';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components
import IssueDetailsModal from './IssueDetailsModal';

// CSS
import styles from './IssueSearchCell.module.css';

// Types
interface IssueSearchCellProps {
    issueId: number;
    volumeId: number;
    issueTitle: string;
    showOpenVolumeButton: boolean;
}

// IMPLEMENTATIONS

function IssueSearchCell({
    issueId,
    volumeId,
    issueTitle,
    showOpenVolumeButton,
}: IssueSearchCellProps) {
    const [executeCommand, executeCommandState] = useExecuteCommandMutation();

    const isSearching = executeCommandState.isLoading;

    const [isDetailsModalOpen, setDetailsModalOpen, setDetailsModalClosed] =
        useModalOpenState(false);

    const handleSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.ISSUE_SEARCH,
            volumeId,
            issueId,
        });
    }, [issueId, volumeId, executeCommand]);

    return (
        <TableRowCell className={styles.issueSearchCell}>
            <SpinnerIconButton
                name={icons.SEARCH}
                isSpinning={isSearching}
                title={translate('AutomaticSearch')}
                onPress={handleSearchPress}
            />

            <IconButton
                name={icons.INTERACTIVE}
                title={translate('InteractiveSearch')}
                onPress={setDetailsModalOpen}
            />

            <IssueDetailsModal
                isOpen={isDetailsModalOpen}
                issueId={issueId}
                volumeId={volumeId}
                issueTitle={issueTitle}
                selectedTab="search"
                startInteractiveSearch={true}
                showOpenVolumeButton={showOpenVolumeButton}
                onModalClose={setDetailsModalClosed}
            />
        </TableRowCell>
    );
}

export default IssueSearchCell;
