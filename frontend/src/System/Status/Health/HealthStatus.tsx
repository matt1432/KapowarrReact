// IMPORTS

// Redux
import { useGetStatusChecksQuery } from 'Store/Api/Status';

// Misc
import { socketEvents } from 'Helpers/Props';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';

// IMPLEMENTATIONS

export default function HealthStatus() {
    const { count, refetch } = useGetStatusChecksQuery(undefined, {
        selectFromResult: ({ data }) => ({
            count: data?.length ?? 0,
        }),
    });

    useSocketCallback(socketEvents.STATUS_COUNT, refetch);

    return <PageSidebarStatus count={count} hasWarnings={count > 0} />;
}
