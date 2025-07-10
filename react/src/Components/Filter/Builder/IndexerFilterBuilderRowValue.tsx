import { useEffect, useMemo } from 'react';
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { type AppState } from 'App/State/AppState';
// import { fetchIndexers } from 'Store/Actions/settingsActions';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

type IndexerFilterBuilderRowValueProps<T> = Omit<FilterBuilderRowValueProps<T, number>, 'tagList'>;

function IndexerFilterBuilderRowValue<T>(props: IndexerFilterBuilderRowValueProps<T>) {
    const dispatch = useDispatch();

    // const { isPopulated, items } = useSelector((state: AppState) => state.settings.indexers);
    const isPopulated = false;

    // @ts-expect-error TODO:
    const items = [];

    const tagList = useMemo(() => {
        // @ts-expect-error TODO:
        return items.map((item) => {
            return {
                id: item.id,
                name: item.name,
            };
        });
        // @ts-expect-error TODO:
    }, [items]);

    useEffect(() => {
        if (!isPopulated) {
            // dispatch(fetchIndexers());
        }
    }, [isPopulated, dispatch]);

    return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default IndexerFilterBuilderRowValue;
