import { useEffect, useMemo } from 'react';
import { useLazyGetSettingsQuery } from 'Store/Api/Settings';

import { useLazyGetVolumesQuery } from 'Store/Api/Volumes';
import { useRootSelector } from 'Store/createAppStore';

export default function useAppPage() {
    const { apiKey } = useRootSelector((state) => state.auth);

    // TODO: all queries needed before page is loaded
    const [getVolumes, getVolumesState] = useLazyGetVolumesQuery(undefined);
    const [getSettings, getSettingsState] = useLazyGetSettingsQuery(undefined);

    const queries = useMemo(
        () => [getVolumesState, getSettingsState],
        [getVolumesState, getSettingsState],
    );
    const triggers = useMemo(
        () => [() => getVolumes(undefined), () => getSettings(undefined)],
        [getVolumes, getSettings],
    );

    const erroredQueries = useMemo(() => queries.filter(({ isError }) => isError), [queries]);
    const isPopulated = useMemo(
        () => queries.every(({ data, isSuccess }) => data && isSuccess),
        [queries],
    );
    const hasError = useMemo(() => erroredQueries.length > 0, [erroredQueries.length]);

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
}
