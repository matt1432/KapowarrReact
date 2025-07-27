// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// IMPLEMENTATIONS

function VolumeMonitorNewItemsOptionsPopoverContent() {
    return (
        <DescriptionList>
            <DescriptionListItem
                title={translate('MonitorAllIssues')}
                data={translate('MonitorAllIssuesDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorNoFutureIssues')}
                data={translate('MonitorNoFutureDescription')}
            />
        </DescriptionList>
    );
}

export default VolumeMonitorNewItemsOptionsPopoverContent;
