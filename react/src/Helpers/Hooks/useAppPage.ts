// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/Helpers/Hooks/useAppPage.ts
import { useMemo } from 'react';

const useAppPage = () => {
    const isPopulated = true;

    const hasError = false;

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
        return { errors: [], hasError, isLocalStorageSupported, isPopulated };
    }, [hasError, isLocalStorageSupported, isPopulated]);
};

export default useAppPage;
