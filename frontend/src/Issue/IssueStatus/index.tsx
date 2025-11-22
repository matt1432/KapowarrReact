// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useFetchQueueDetails } from 'Store/Api/Queue';

// Misc
import { icons, kinds, sizes } from 'Helpers/Props';

import getRelativeDate from 'Utilities/Date/getRelativeDate';
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
    isMarvelIssue?: boolean;
}

// IMPLEMENTATIONS

export default function IssueStatus({
    issue,
    issueFile,
    isMarvelIssue = false,
}: IssueStatusProps) {
    const { showRelativeDates, shortDateFormat, timeFormat } = useRootSelector(
        (state) => state.uiSettings,
    );

    const { queue } = useFetchQueueDetails({
        volumeId: issue.volumeId,
        issueId: issue.id,
    });

    if (isMarvelIssue) {
        return (
            <div className={styles.center}>
                <Icon
                    name={icons.NOT_AIRED}
                    title={translate('IssueHasNotAired', {
                        date: issue.date
                            ? `(${getRelativeDate({
                                  date: issue.date,
                                  shortDateFormat,
                                  showRelativeDates,
                                  timeFormat,
                                  includeSeconds: false,
                                  includeTime: false,
                                  timeForToday: true,
                              })})`
                            : '',
                    })}
                />
            </div>
        );
    }

    const hasIssueFile = Boolean(issueFile);
    const isQueued = queue.length !== 0;

    if (isQueued) {
        const { progress } = queue[0];

        return (
            <div className={styles.center}>
                <ProgressBar
                    progress={progress}
                    kind={kinds.PURPLE}
                    size={sizes.MEDIUM}
                />
            </div>
        );
    }

    if (hasIssueFile) {
        return (
            <div className={styles.center}>
                <Icon
                    name={icons.FILE}
                    kind={kinds.SUCCESS}
                    title={translate('IssueDownloaded')}
                />
            </div>
        );
    }

    if (!issue.monitored) {
        return null;
    }

    return (
        <div className={styles.center}>
            <Icon
                name={icons.DANGER}
                title={translate('IssueMissingFromDisk')}
            />
        </div>
    );
}
