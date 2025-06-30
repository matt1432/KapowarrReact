import translate from 'Utilities/String/translate';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

const statusTagList = [
    {
        id: 'continuing',
        get name() {
            return translate('Continuing');
        },
    },
    {
        id: 'upcoming',
        get name() {
            return translate('Upcoming');
        },
    },
    {
        id: 'ended',
        get name() {
            return translate('Ended');
        },
    },
    {
        id: 'deleted',
        get name() {
            return translate('Deleted');
        },
    },
];

type VolumesStatusFilterBuilderRowValueProps<T> = Omit<
    FilterBuilderRowValueProps<T, string>,
    'tagList'
>;

function VolumesStatusFilterBuilderRowValue<T>(props: VolumesStatusFilterBuilderRowValueProps<T>) {
    return <FilterBuilderRowValue tagList={statusTagList} {...props} />;
}

export default VolumesStatusFilterBuilderRowValue;
