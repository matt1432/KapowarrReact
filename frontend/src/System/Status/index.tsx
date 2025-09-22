// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import AboutInfo from './AboutInfo';
import Links from './Links';

// IMPLEMENTATIONS

export default function Status() {
    return (
        <PageContent title={translate('Status')}>
            <PageContentBody>
                <AboutInfo />
                <Links />
            </PageContentBody>
        </PageContent>
    );
}
