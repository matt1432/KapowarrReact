import translate from 'Utilities/String/translate';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

const volumesTypeList = [
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

type VolumesTypeFilterBuilderRowValueProps<T> = Omit<
    FilterBuilderRowValueProps<T, string>,
    'tagList'
>;

function VolumesTypeFilterBuilderRowValue<T>(props: VolumesTypeFilterBuilderRowValueProps<T>) {
    return <FilterBuilderRowValue tagList={volumesTypeList} {...props} />;
}

export default VolumesTypeFilterBuilderRowValue;
