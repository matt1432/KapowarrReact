// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { fetchIndexers } from 'Store/Actions/settingsActions';

// Misc
// import sortByProp from 'Utilities/Array/sortByProp';
// import translate from 'Utilities/String/translate';

// Specific Components
import EnhancedSelectInput from './EnhancedSelectInput';

export interface IndexerSelectInputProps {
    name: string;
    value: number;
    includeAny?: boolean;
    onChange: (change: EnhancedSelectInputChanged<number>) => void;
}

// Types
import type { EnhancedSelectInputChanged } from 'typings/inputs';

// IMPLEMENTATIONS

/*
function createIndexersSelector(includeAny: boolean) {
    return createSelector(
        (state: AppState) => state.settings.indexers,
        (indexers) => {
            const { isFetching, isPopulated, error, items } = indexers;

            const values = items.sort(sortByProp('name')).map((indexer) => {
                return {
                    key: indexer.id,
                    value: indexer.name,
                };
            });

            if (includeAny) {
                values.unshift({
                    key: 0,
                    value: `(${translate('Any')})`,
                });
            }

            return {
                isFetching,
                isPopulated,
                error,
                values,
            };
        },
    );
}
*/

function IndexerSelectInput({
    name,
    value,
    // includeAny = false,
    onChange,
}: IndexerSelectInputProps) {
    const dispatch = useDispatch();
    // const { isFetching, isPopulated, values } = useSelector(createIndexersSelector(includeAny));
    const isFetching = false;
    const isPopulated = false;

    // @ts-expect-error TODO:
    const values = [];

    useEffect(() => {
        if (!isPopulated) {
            // dispatch(fetchIndexers());
        }
    }, [isPopulated, dispatch]);

    return (
        <EnhancedSelectInput
            name={name}
            value={value}
            isFetching={isFetching}
            // @ts-expect-error TODO:
            values={values}
            onChange={onChange}
        />
    );
}

export default IndexerSelectInput;
