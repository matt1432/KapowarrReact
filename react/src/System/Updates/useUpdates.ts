// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/System/Updates/useUpdates.ts
// import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { type Update } from 'typings/Update';

const useUpdates = () => {
    // const result = useApiQuery<Update[]>({
    //     path: '/update',
    // });

    return {
        // ...result,
        isLoading: false,
        isFetched: true,
        error: false,
        data: [] as Update[], // result.data ?? [],
    };
};

export default useUpdates;
