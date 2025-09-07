// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import BlocklistTable from './BlocklistTable';

// IMPLEMENTATIONS

export default function HistoryPage() {
    return (
        <PageContent title={translate('Blocklist')}>
            <PageContentBody>
                <BlocklistTable />
            </PageContentBody>
        </PageContent>
    );
}
