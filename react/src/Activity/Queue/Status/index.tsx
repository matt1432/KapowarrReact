// IMPORTS

// Redux
import { useGetQueueQuery } from 'Store/Api/Queue';

// General Components
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';

// IMPLEMENTATIONS

export default function QueueStatus() {
    const { count, hasErrors } = useGetQueueQuery(undefined, {
        selectFromResult: ({ data }) => ({
            count: data?.length ?? 0,
            hasErrors: Boolean(data?.some((item) => item.status === 'failed')),
        }),
    });

    return <PageSidebarStatus count={count} hasErrors={hasErrors} />;
}
