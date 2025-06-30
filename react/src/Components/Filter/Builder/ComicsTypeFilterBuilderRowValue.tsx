import translate from 'Utilities/String/translate';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

const comicsTypeList = [
    {
        id: 'anime',
        get name() {
            return translate('Anime');
        },
    },
    {
        id: 'daily',
        get name() {
            return translate('Daily');
        },
    },
    {
        id: 'standard',
        get name() {
            return translate('Standard');
        },
    },
];

type ComicsTypeFilterBuilderRowValueProps<T> = Omit<
    FilterBuilderRowValueProps<T, string>,
    'tagList'
>;

function ComicsTypeFilterBuilderRowValue<T>(props: ComicsTypeFilterBuilderRowValueProps<T>) {
    return <FilterBuilderRowValue tagList={comicsTypeList} {...props} />;
}

export default ComicsTypeFilterBuilderRowValue;
