// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components
import IssueDetailsModal from '../IssueDetailsModal';

// CSS
import styles from './index.module.css';

// Types
interface IssueSearchCellProps {
    issueId: number;
    volumeId: number;
    issueTitle: string;
    showOpenVolumeButton: boolean;
}

// IMPLEMENTATIONS

export default function IssueSearchCell({
    issueId,
    volumeId,
    issueTitle,
    showOpenVolumeButton,
}: IssueSearchCellProps) {
    const [executeCommand, { isLoading: isSearching }] = useExecuteCommandMutation();

    const [isDetailsModalOpen, setDetailsModalOpen, setDetailsModalClosed] =
        useModalOpenState(false);

    const [startInteractiveSearch, setStartInteractiveSearch] = useState(true);
    const [startLibgenFileSearch, setStartLibgenFileSearch] = useState(false);

    const handleInteractiveSearchPress = useCallback(() => {
        setStartInteractiveSearch(true);
        setStartLibgenFileSearch(false);
        setDetailsModalOpen();
    }, [setDetailsModalOpen]);

    const handleLibgenFileSearchPress = useCallback(() => {
        setStartInteractiveSearch(false);
        setStartLibgenFileSearch(true);
        setDetailsModalOpen();
    }, [setDetailsModalOpen]);

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
                onPress={handleInteractiveSearchPress}
            />

            <IconButton
                name={icons.LIBGEN_FILE_SEARCH}
                title={translate('LibgenFileSearch')}
                onPress={handleLibgenFileSearchPress}
            />

            <IssueDetailsModal
                isOpen={isDetailsModalOpen}
                issueId={issueId}
                volumeId={volumeId}
                issueTitle={issueTitle}
                selectedTab="search"
                startInteractiveSearch={startInteractiveSearch}
                startLibgenFileSearch={startLibgenFileSearch}
                showOpenVolumeButton={showOpenVolumeButton}
                onModalClose={setDetailsModalClosed}
            />
        </TableRowCell>
    );
}
