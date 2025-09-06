// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import History from 'History';

// IMPLEMENTATIONS

export default function HistoryPage() {
    return (
        <PageContent title={translate('History')}>
            <PageContentBody>
                <History />
            </PageContentBody>
        </PageContent>
    );
}
