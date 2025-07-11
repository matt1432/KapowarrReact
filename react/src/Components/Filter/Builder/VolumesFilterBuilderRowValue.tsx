// import { useSelector } from 'react-redux';
import { type Volume } from 'Volumes/Volumes';
// import createAllVolumesSelector from 'Store/Selectors/createAllVolumesSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import FilterBuilderRowValue, { type FilterBuilderRowValueProps } from './FilterBuilderRowValue';

type VolumesFilterBuilderRowValueProps<T> = Omit<FilterBuilderRowValueProps<T, number>, 'tagList'>;

function VolumesFilterBuilderRowValue<T>(props: VolumesFilterBuilderRowValueProps<T>) {
    const allVolumes: Volume[] = []; // useSelector(createAllVolumesSelector());

    const tagList = allVolumes
        .map((volumes) => ({ id: volumes.id, name: volumes.title }))
        .sort(sortByProp('name'));

    return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default VolumesFilterBuilderRowValue;
