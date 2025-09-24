// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { getIssueStatus } from 'Store/Slices/SocketEvents';
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, icons, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';

// Specific Components
import InteractiveSearch, { LibgenFileSearch } from 'InteractiveSearch';

// CSS
import styles from './index.module.css';

// Types
interface IssueSearchProps {
    issueId: number;
    volumeId: number;
    startInteractiveSearch: boolean;
    startLibgenFileSearch: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function IssueSearch({
    issueId,
    volumeId,
    startInteractiveSearch,
    startLibgenFileSearch,
    onModalClose,
}: IssueSearchProps) {
    const { isSearching } = useRootSelector((state) => getIssueStatus(state, volumeId, issueId));

    const [executeCommand] = useExecuteCommandMutation();

    const [isInteractiveSearchOpen, setIsInteractiveSearchOpen] = useState(startInteractiveSearch);
    useEffect(() => {
        setIsInteractiveSearchOpen(startInteractiveSearch);
    }, [startInteractiveSearch]);

    const [isLibgenFileSearchOpen, setIsLibgenFileSearchOpen] = useState(startLibgenFileSearch);
    useEffect(() => {
        setIsLibgenFileSearchOpen(startLibgenFileSearch);
    }, [startLibgenFileSearch]);

    const handleQuickSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.ISSUE_SEARCH,
            volumeId,
            issueId,
        });

        onModalClose();
    }, [issueId, onModalClose, executeCommand, volumeId]);

    const handleInteractiveSearchPress = useCallback(() => {
        setIsInteractiveSearchOpen(true);
    }, []);

    const handleLibgenFileSearchPress = useCallback(() => {
        setIsLibgenFileSearchOpen(true);
    }, []);

    if (isInteractiveSearchOpen) {
        return <InteractiveSearch searchPayload={{ issueId }} />;
    }

    if (isLibgenFileSearchOpen) {
        return <LibgenFileSearch searchPayload={{ issueId }} />;
    }

    return (
        <div>
            <div className={styles.buttonContainer}>
                <Button
                    className={styles.button}
                    size={sizes.LARGE}
                    onPress={handleQuickSearchPress}
                    isDisabled={isSearching}
                >
                    <Icon className={styles.buttonIcon} name={icons.QUICK} />

                    {translate('QuickSearch')}
                </Button>
            </div>

            <div className={styles.buttonContainer}>
                <Button
                    className={styles.button}
                    kind={kinds.PRIMARY}
                    size={sizes.LARGE}
                    onPress={handleInteractiveSearchPress}
                >
                    <Icon className={styles.buttonIcon} name={icons.INTERACTIVE} />

                    {translate('InteractiveSearch')}
                </Button>
            </div>

            <div className={styles.buttonContainer}>
                <Button
                    className={styles.button}
                    kind={kinds.PRIMARY}
                    size={sizes.LARGE}
                    onPress={handleLibgenFileSearchPress}
                >
                    <Icon className={styles.buttonIcon} name={icons.LIBGEN_FILE_SEARCH} />

                    {translate('LibgenFileSearch')}
                </Button>
            </div>
        </div>
    );
}
