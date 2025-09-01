// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, icons, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';

// Specific Components
import InteractiveSearch from 'InteractiveSearch';

// CSS
import styles from './index.module.css';

// Types
interface IssueSearchProps {
    issueId: number;
    volumeId: number;
    startInteractiveSearch: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

// TODO: add libgen file search

export default function IssueSearch({
    issueId,
    volumeId,
    startInteractiveSearch,
    onModalClose,
}: IssueSearchProps) {
    const [executeCommand] = useExecuteCommandMutation();

    const [isInteractiveSearchOpen, setIsInteractiveSearchOpen] = useState(startInteractiveSearch);

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

    if (isInteractiveSearchOpen) {
        return <InteractiveSearch searchPayload={{ issueId }} />;
    }

    return (
        <div>
            <div className={styles.buttonContainer}>
                <Button
                    className={styles.button}
                    size={sizes.LARGE}
                    onPress={handleQuickSearchPress}
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
        </div>
    );
}
