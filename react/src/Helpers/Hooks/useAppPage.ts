import { useEffect, useMemo, useState } from 'react';

import { useLazyGetVolumesQuery } from 'Store/createApiEndpoints';
import { useRootSelector } from 'Store/createAppStore';

const useAppPage = () => {
    const { apiKey } = useRootSelector((state) => state.auth);

    // TODO: all queries needed before page is loaded
    const [getVolumes, getVolumesState] = useLazyGetVolumesQuery(undefined);

    const queries = [getVolumesState];
    const [triggers] = useState([() => getVolumes(undefined)]);

    const erroredQueries = queries.filter(({ isError }) => isError);
    const isPopulated = queries.every(({ data, isSuccess }) => data && isSuccess);
    const hasError = erroredQueries.length > 0;

    useEffect(() => {
        if (apiKey) {
            window.Kapowarr.apiKey = apiKey;
            triggers.forEach((trigger) => {
                trigger();
            });
        }
    }, [apiKey, triggers]);

    return useMemo(() => {
        return {
            errors: erroredQueries.map(({ error }) => error),
            needsAuth: !apiKey,
            hasError,
            isPopulated,
        };
    }, [apiKey, erroredQueries, hasError, isPopulated]);
};

export default useAppPage;
