import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { type Update } from 'typings/Update';

const useUpdates = () => {
    const result = useApiQuery<Update[]>({
        path: '/update',
    });

    return {
        ...result,
        isLoading: false,
        isFetched: true,
        error: false,
        data: result.data ?? [],
    };
};

export default useUpdates;
