// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/System/Updates/Updates.tsx
// IMPORTS

// React

// Redux

// Misc
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components

// CSS

// Types

// IMPLEMENTATIONS

function Updates() {
    return (
        <PageContent title={translate('Updates')}>
            <PageContentBody>
                <Alert kind={kinds.INFO}>{translate('NoUpdatesAreAvailable')}</Alert>
            </PageContentBody>
        </PageContent>
    );
}

export default Updates;
