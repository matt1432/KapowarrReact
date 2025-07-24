// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// IMPLEMENTATIONS

// FIXME: add the Kapowarr info

function SpecialVersionPopoverContent() {
    return (
        <DescriptionList>
            <DescriptionListItem
                title={translate('Daily')}
                data={translate('DailyIssueTypeDescription')}
            />

            <DescriptionListItem
                title={translate('Standard')}
                data={translate('StandardIssueTypeDescription')}
            />
        </DescriptionList>
    );
}

export default SpecialVersionPopoverContent;
