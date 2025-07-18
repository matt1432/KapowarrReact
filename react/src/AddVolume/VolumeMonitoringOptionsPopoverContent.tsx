// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// IMPLEMENTATIONS

function VolumeMonitoringOptionsPopoverContent() {
    return (
        <DescriptionList>
            <DescriptionListItem
                title={translate('MonitorAllIssues')}
                data={translate('MonitorAllIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorFutureIssues')}
                data={translate('MonitorFutureIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorMissingIssues')}
                data={translate('MonitorMissingIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorExistingIssues')}
                data={translate('MonitorExistingIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorRecentIssues')}
                data={translate('MonitorRecentIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorPilotIssue')}
                data={translate('MonitorPilotIssueDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorFirstSeason')}
                data={translate('MonitorFirstSeasonDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorLastSeason')}
                data={translate('MonitorLastSeasonDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorSpecialIssues')}
                data={translate('MonitorSpecialIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('UnmonitorSpecialIssues')}
                data={translate('UnmonitorSpecialsIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorNoIssues')}
                data={translate('MonitorNoIssuesDescription')}
            />
        </DescriptionList>
    );
}

export default VolumeMonitoringOptionsPopoverContent;
