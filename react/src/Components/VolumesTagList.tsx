import { useSelector } from 'react-redux';
import createTagsSelector from 'Store/Selectors/createTagsSelector';
import TagList from './TagList';

interface VolumesTagListProps {
    tags: number[];
}

function VolumesTagList({ tags }: VolumesTagListProps) {
    const tagList = useSelector(createTagsSelector());

    return <TagList tags={tags} tagList={tagList} />;
}

export default VolumesTagList;
