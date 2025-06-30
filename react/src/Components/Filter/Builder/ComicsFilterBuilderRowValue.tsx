import { useSelector } from 'react-redux';
import { type Comics } from 'Comics/Comics';
import createAllComicsSelector from 'Store/Selectors/createAllComicsSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

type ComicsFilterBuilderRowValueProps<T> = Omit<FilterBuilderRowValueProps<T, number>, 'tagList'>;

function ComicsFilterBuilderRowValue<T>(props: ComicsFilterBuilderRowValueProps<T>) {
    const allComics: Comics[] = useSelector(createAllComicsSelector());

    const tagList = allComics
        .map((comics) => ({ id: comics.id, name: comics.title }))
        .sort(sortByProp('name'));

    return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default ComicsFilterBuilderRowValue;
