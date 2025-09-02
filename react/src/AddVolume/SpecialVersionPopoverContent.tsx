// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// IMPLEMENTATIONS

function SpecialVersionPopoverContent() {
    return (
        <DescriptionList>
            <DescriptionListItem
                title={translate('SvTradePaperback')}
                data={translate('SvTradePaperbackDescription')}
            />
            <DescriptionListItem
                title={translate('SvOneShot')}
                data={translate('SvOneShotDescription')}
            />
            <DescriptionListItem
                title={translate('SvHardCover')}
                data={translate('SvHardCoverDescription')}
            />
            <DescriptionListItem
                title={translate('SvVolAsIssue')}
                data={translate('SvVolAsIssueDescription')}
            />
            <DescriptionListItem
                title={translate('SvCover')}
                data={translate('SvCoverDescription')}
            />
            <DescriptionListItem
                title={translate('SvMetadata')}
                data={translate('SvMetadataDescription')}
            />

            <DescriptionListItem
                title={translate('SvStandard')}
                data={translate('SvStandardDescription')}
            />
        </DescriptionList>
    );
}

export default SpecialVersionPopoverContent;
