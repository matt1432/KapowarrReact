import { useMemo } from 'react';
import { useGetVolumesQuery } from 'Store/createApiEndpoints';

const useAppPage = () => {
    // TODO: all all queries needed before page is loaded
    const queries = [useGetVolumesQuery(undefined)];

    const erroredQueries = queries.filter(({ isError }) => isError);

    const isPopulated = queries.every(({ data, isSuccess }) => data && isSuccess);
    const hasError = erroredQueries.length > 0;

    const isLocalStorageSupported = useMemo(() => {
        const key = 'kapowarrTest';

        try {
            localStorage.setItem(key, key);
            localStorage.removeItem(key);

            return true;
        }
        catch {
            return false;
        }
    }, []);

    return useMemo(() => {
        return {
            errors: erroredQueries.map(({ error }) => error),
            hasError,
            isLocalStorageSupported,
            isPopulated,
        };
    }, [erroredQueries, hasError, isLocalStorageSupported, isPopulated]);
};

export default useAppPage;
