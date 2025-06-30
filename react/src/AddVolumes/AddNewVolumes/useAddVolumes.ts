import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { type AddVolumes } from 'AddVolumes/AddVolumes';
import { type AddVolumesOptions } from 'AddVolumes/addVolumesOptionsStore';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { type Volumes } from 'Volumes/Volumes';
// import { updateItem } from 'Store/Actions/baseActions';

type AddVolumesPayload = AddVolumes & AddVolumesOptions;

export const useLookupVolumes = (query: string) => {
    return useApiQuery<AddVolumes[]>({
        path: '/volumes/lookup',
        queryParams: {
            term: query,
        },
        queryOptions: {
            enabled: !!query,
            // Disable refetch on window focus to prevent refetching when the user switch tabs
            refetchOnWindowFocus: false,
        },
    });
};

export const useAddVolumes = () => {
    const dispatch = useDispatch();

    const onAddSuccess = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (data: Volumes) => {
            // dispatch(updateItem({ section: 'volumes', ...data }));
        },
        [dispatch],
    );

    return useApiMutation<Volumes, AddVolumesPayload>({
        path: '/volumes',
        method: 'POST',
        mutationOptions: {
            onSuccess: onAddSuccess,
        },
    });
};
