// import { useSelector } from 'react-redux';
// import createTagsSelector from 'Store/Selectors/createTagsSelector';
import TagList from './TagList';

interface VolumesTagListProps {
    tags: number[];
}

function VolumesTagList({ tags }: VolumesTagListProps) {
    // const tagList = useSelector(createTagsSelector());
    // @ts-expect-error TODO
    const tagList = [];

    // @ts-expect-error TODO
    return <TagList tags={tags} tagList={tagList} />;
}

export default VolumesTagList;
