// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/System/Updates/Updates.tsx
import Alert from 'Components/Alert';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

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
