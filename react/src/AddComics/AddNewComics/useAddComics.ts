import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { type AddComics } from 'AddComics/AddComics';
import { type AddComicsOptions } from 'AddComics/addComicsOptionsStore';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { type Comics } from 'Comics/Comics';
// import { updateItem } from 'Store/Actions/baseActions';

type AddComicsPayload = AddComics & AddComicsOptions;

export const useLookupComics = (query: string) => {
    return useApiQuery<AddComics[]>({
        path: '/comics/lookup',
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

export const useAddComics = () => {
    const dispatch = useDispatch();

    const onAddSuccess = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (data: Comics) => {
            // dispatch(updateItem({ section: 'comics', ...data }));
        },
        [dispatch],
    );

    return useApiMutation<Comics, AddComicsPayload>({
        path: '/comics',
        method: 'POST',
        mutationOptions: {
            onSuccess: onAddSuccess,
        },
    });
};
