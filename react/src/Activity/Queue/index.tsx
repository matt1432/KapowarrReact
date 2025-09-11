// TODO:
// IMPORTS

// React

// Redux
import { useGetQueueQuery } from 'Store/Api/Queue';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';

// Specific Components

// IMPLEMENTATIONS

export default function Queue() {
    const { isRefreshing, refetch } = useGetQueueQuery(undefined, {
        selectFromResult: ({ isFetching }) => ({
            isRefreshing: isFetching,
        }),
    });

    return (
        <PageContent title={translate('Queue')}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        iconName={icons.REFRESH}
                        label={translate('Refresh')}
                        isSpinning={isRefreshing}
                        onPress={refetch}
                    />
                </PageToolbarSection>
            </PageToolbar>

            <PageContentBody>TODO:</PageContentBody>
        </PageContent>
    );
}
