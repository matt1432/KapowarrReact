import classNames from 'classnames';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import formatSeason from 'Season/formatSeason';
import { type Statistics } from 'Volumes/Volumes';
// import { toggleSeasonMonitored } from 'Store/Actions/volumesActions';
import translate from 'Utilities/String/translate';
import styles from './SeasonPassSeason.module.css';

interface SeasonPassSeasonProps {
    volumesId: number;
    seasonNumber: number;
    monitored: boolean;
    statistics: Statistics;
    isSaving: boolean;
}

function SeasonPassSeason(props: SeasonPassSeasonProps) {
    const {
        volumesId,
        seasonNumber,
        monitored,
        statistics = {
            issueFileCount: 0,
            totalIssueCount: 0,
            percentOfIssues: 0,
        },
        isSaving = false,
    } = props;

    const { issueFileCount, totalIssueCount, percentOfIssues } = statistics;

    const dispatch = useDispatch();
    const onSeasonMonitoredPress = useCallback(() => {
        // dispatch(toggleSeasonMonitored({ volumesId, seasonNumber, monitored: !monitored }));
    }, [volumesId, seasonNumber, monitored, dispatch]);

    return (
        <div className={styles.season}>
            <div className={styles.info}>
                <MonitorToggleButton
                    monitored={monitored}
                    isSaving={isSaving}
                    onPress={onSeasonMonitoredPress}
                />

                <span>{formatSeason(seasonNumber, true)}</span>
            </div>

            <div
                className={classNames(styles.issues, percentOfIssues === 100 && styles.allIssues)}
                title={translate('SeasonPassIssuesDownloaded', {
                    issueFileCount,
                    totalIssueCount,
                })}
            >
                {totalIssueCount === 0 ? '0/0' : `${issueFileCount}/${totalIssueCount}`}
            </div>
        </div>
    );
}

export default SeasonPassSeason;
