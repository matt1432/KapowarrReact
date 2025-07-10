// import { useSelector } from 'react-redux';
// import createLanguagesSelector from 'Store/Selectors/createLanguagesSelector';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

type LanguageFilterBuilderRowValueProps<T> = Omit<FilterBuilderRowValueProps<T, number>, 'tagList'>;

function LanguageFilterBuilderRowValue<T>(props: LanguageFilterBuilderRowValueProps<T>) {
    // const { items } = useSelector(createLanguagesSelector());
    // @ts-expect-error TODO:
    const items = [];

    // @ts-expect-error TODO:
    return <FilterBuilderRowValue {...props} tagList={items} />;
}

export default LanguageFilterBuilderRowValue;
