import { type VolumesMonitor } from 'Volumes/Volumes';
import translate from 'Utilities/String/translate';

interface MonitorOption {
    key: VolumesMonitor;
    value: string;
}

const monitorOptions: MonitorOption[] = [
    {
        key: 'all',
        get value() {
            return translate('MonitorAllIssues');
        },
    },
    {
        key: 'future',
        get value() {
            return translate('MonitorFutureIssues');
        },
    },
    {
        key: 'missing',
        get value() {
            return translate('MonitorMissingIssues');
        },
    },
    {
        key: 'existing',
        get value() {
            return translate('MonitorExistingIssues');
        },
    },
    {
        key: 'recent',
        get value() {
            return translate('MonitorRecentIssues');
        },
    },
    {
        key: 'pilot',
        get value() {
            return translate('MonitorPilotIssue');
        },
    },
    {
        key: 'firstSeason',
        get value() {
            return translate('MonitorFirstSeason');
        },
    },
    {
        key: 'lastSeason',
        get value() {
            return translate('MonitorLastSeason');
        },
    },
    {
        key: 'monitorSpecials',
        get value() {
            return translate('MonitorSpecialIssues');
        },
    },
    {
        key: 'unmonitorSpecials',
        get value() {
            return translate('UnmonitorSpecialIssues');
        },
    },
    {
        key: 'none',
        get value() {
            return translate('MonitorNoIssues');
        },
    },
];

export default monitorOptions;
