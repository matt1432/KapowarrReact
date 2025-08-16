// IMPORTS

// Redux
import { useFetchQueueDetails } from 'Store/Api/Queue';

// Misc
import { icons, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import ProgressBar from 'Components/ProgressBar';

// CSS
import styles from './index.module.css';

// Types
import type { Issue, IssueFileData } from 'Issue/Issue';

interface IssueStatusProps {
    issue: Issue;
    issueFile?: IssueFileData;
}

// IMPLEMENTATIONS

function IssueStatus({ issue, issueFile }: IssueStatusProps) {
    const { queue } = useFetchQueueDetails({ volumeId: issue.volumeId, issueId: issue.id });

    const hasIssueFile = Boolean(issueFile);
    const isQueued = queue.length !== 0;

    if (isQueued) {
        const { progress: downloaded, size } = queue[0];

        const sizeleft = size - downloaded;

        const progress = size ? 100 - (sizeleft / size) * 100 : 0;

        return (
            <div className={styles.center}>
                <ProgressBar progress={progress} kind={kinds.PURPLE} size={sizes.MEDIUM} />
            </div>
        );
    }

    if (hasIssueFile) {
        return (
            <div className={styles.center}>
                <Icon name={icons.FILE} kind={kinds.SUCCESS} title={translate('IssueDownloaded')} />
            </div>
        );
    }

    if (!issue.monitored) {
        return null;
    }

    return (
        <div className={styles.center}>
            <Icon name={icons.NOT_AIRED} title={translate('IssueHasNotAired')} />
        </div>
    );
}

export default IssueStatus;
