import type { VolumeMonitor } from 'Volume/Volume';
import translate from 'Utilities/String/translate';

interface MonitorOption {
    key: VolumeMonitor;
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
        key: 'missing',
        get value() {
            return translate('MonitorMissingIssues');
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
