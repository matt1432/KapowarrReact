// IMPORTS

// React
import { useEffect, useMemo } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';

import { useLazyGetRootFoldersQuery } from 'Store/Api/RootFolders';
import { useLazyGetSettingsQuery } from 'Store/Api/Settings';
import { useLazyGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import filterObject from 'Utilities/Object/filterObject';

// Types
import type { AnyError } from 'typings/Api';
import { setFormsAuth } from 'Store/Slices/Auth';

// IMPLEMENTATIONS

export default function useAppPage() {
    const dispatch = useRootDispatch();

    const { apiKey } = useRootSelector((state) => state.auth);

    // all queries needed before page is loaded
    const [getRootFolders, getRootFoldersState] = useLazyGetRootFoldersQuery();
    const [getSettings, getSettingsState] = useLazyGetSettingsQuery();
    const [getVolumes, getVolumesState] = useLazyGetVolumesQuery();

    useEffect(() => {
        const data = getSettingsState.data;

        if (data) {
            dispatch(setFormsAuth(Boolean(data.authPassword)));
        }
    }, [dispatch, getSettingsState.data]);

    const queries = useMemo(
        () => [getRootFoldersState, getSettingsState, getVolumesState],
        [getRootFoldersState, getSettingsState, getVolumesState],
    );
    const triggers = useMemo(
        () => [() => getRootFolders(), () => getSettings(), () => getVolumes()],
        [getRootFolders, getSettings, getVolumes],
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
            errors: filterObject(
                {
                    rootFoldersError: getRootFoldersState.error,
                    settingsError: getSettingsState.error,
                    volumesError: getVolumesState.error,
                },
                (item) => typeof item !== 'undefined',
            ) as Partial<Record<'rootFoldersError' | 'settingsError' | 'volumesError', AnyError>>,
            needsAuth: !apiKey,
            hasError,
            isPopulated,
        };
    }, [
        apiKey,
        hasError,
        isPopulated,
        getRootFoldersState.error,
        getSettingsState.error,
        getVolumesState.error,
    ]);
}
