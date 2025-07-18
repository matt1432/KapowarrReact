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
                title={translate('MonitorAllSeasons')}
                data={translate('MonitorAllSeasonsDescription')}
            />

            <DescriptionListItem
                title={translate('MonitorNoNewSeasons')}
                data={translate('MonitorNoNewSeasonsDescription')}
            />
        </DescriptionList>
    );
}

export default VolumeMonitorNewItemsOptionsPopoverContent;
