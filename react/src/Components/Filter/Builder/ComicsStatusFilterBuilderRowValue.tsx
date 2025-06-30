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

type ComicsStatusFilterBuilderRowValueProps<T> = Omit<
    FilterBuilderRowValueProps<T, string>,
    'tagList'
>;

function ComicsStatusFilterBuilderRowValue<T>(props: ComicsStatusFilterBuilderRowValueProps<T>) {
    return <FilterBuilderRowValue tagList={statusTagList} {...props} />;
}

export default ComicsStatusFilterBuilderRowValue;
