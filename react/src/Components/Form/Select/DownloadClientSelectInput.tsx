// TODO:
// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { fetchDownloadClients } from 'Store/Actions/settingsActions';

// Misc
// import sortByProp from 'Utilities/Array/sortByProp';
// import translate from 'Utilities/String/translate';

// Specific Components
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';

// Types
import type { Protocol } from 'typings/DownloadClient';
import type { EnhancedSelectInputChanged } from 'typings/inputs';

export interface DownloadClientSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<number>, number>, 'values'> {
    name: string;
    value: number;
    includeAny?: boolean;
    protocol?: Protocol;
    onChange: (change: EnhancedSelectInputChanged<number>) => void;
}

// IMPLEMENTATIONS

/*
function createDownloadClientsSelector(includeAny: boolean, protocol: Protocol) {
    return createSelector(
        (state: AppState) => state.settings.downloadClients,
        (downloadClients) => {
            const { isFetching, isPopulated, error, items } = downloadClients;

            const filteredItems = items.filter((item) => item.protocol === protocol);

            const values = filteredItems.sort(sortByProp('name')).map((downloadClient) => {
                return {
                    key: downloadClient.id,
                    value: downloadClient.name,
                    hint: `(${downloadClient.id})`,
                };
            });

            if (includeAny) {
                values.unshift({
                    key: 0,
                    value: `(${translate('Any')})`,
                    hint: '',
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

function DownloadClientSelectInput({
    // includeAny = false,
    // protocol = 'torrent',
    ...otherProps
}: DownloadClientSelectInputProps) {
    const dispatch = useDispatch();
    // const { isFetching, isPopulated, values } = useSelector(
    //     createDownloadClientsSelector(includeAny, protocol),
    // );
    const isFetching = false;
    const isPopulated = false;

    // @ts-expect-error TODO:
    const values = [];

    useEffect(() => {
        if (!isPopulated) {
            // dispatch(fetchDownloadClients());
        }
    }, [isPopulated, dispatch]);

    // @ts-expect-error TODO:
    return <EnhancedSelectInput {...otherProps} isFetching={isFetching} values={values} />;
}

export default DownloadClientSelectInput;
