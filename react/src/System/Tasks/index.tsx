// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import {
    useClearTaskHistoryMutation,
    useGetTaskHistoryQuery,
    useGetTaskPlanningQuery,
} from 'Store/Api/Status';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// Specific Components
import TaskHistory from './History';
import TaskScheduled from './Scheduled';

// IMPLEMENTATIONS

export default function Status() {
    const { refetch: refetchHistory } = useGetTaskHistoryQuery(undefined, {
        selectFromResult: () => ({}),
    });
    const { refetch: refetchPlanning } = useGetTaskPlanningQuery(undefined, {
        selectFromResult: () => ({}),
    });

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refetch = useCallback(async () => {
        setIsRefreshing(true);

        await refetchHistory();
        await refetchPlanning();

        setIsRefreshing(false);
    }, [refetchHistory, refetchPlanning]);

    const [clearHistory] = useClearTaskHistoryMutation();
    const [isClearing, setIsClearing] = useState(false);
    const handleClearPress = useCallback(async () => {
        setIsClearing(true);
        const { error: clearError } = await clearHistory();

        if (clearError) {
            setIsClearing(false);
            return;
        }

        await refetch();
        setIsClearing(false);
    }, [clearHistory, refetch]);

    return (
        <PageContent title={translate('Tasks')}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        iconName={icons.REFRESH}
                        label={translate('Refresh')}
                        isSpinning={isRefreshing}
                        onPress={refetch}
                    />

                    <PageToolbarButton
                        iconName={icons.DELETE}
                        label={translate('ClearHistory')}
                        isSpinning={isClearing}
                        onPress={handleClearPress}
                    />
                </PageToolbarSection>
            </PageToolbar>

            <PageContentBody>
                <TaskScheduled />
                <TaskHistory />
            </PageContentBody>
        </PageContent>
    );
}
