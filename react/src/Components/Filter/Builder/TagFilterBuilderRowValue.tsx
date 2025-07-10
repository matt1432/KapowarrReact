import { useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import createTagsSelector from 'Store/Selectors/createTagsSelector';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

type TagFilterBuilderRowValueProps<T> = Omit<FilterBuilderRowValueProps<T, number>, 'tagList'>;

function TagFilterBuilderRowValue<T>(props: TagFilterBuilderRowValueProps<T>) {
    // @ts-expect-error TODO:
    const tags = []; // useSelector(createTagsSelector());

    const tagList = useMemo(() => {
        // @ts-expect-error TODO:
        return tags.map((tag) => {
            const { id, label } = tag;

            return {
                id,
                name: label,
            };
        });
        // @ts-expect-error TODO:
    }, [tags]);

    return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default TagFilterBuilderRowValue;
