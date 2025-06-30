import { useSelector } from 'react-redux';
import createTagsSelector from 'Store/Selectors/createTagsSelector';
import TagList from './TagList';

interface ComicsTagListProps {
    tags: number[];
}

function ComicsTagList({ tags }: ComicsTagListProps) {
    const tagList = useSelector(createTagsSelector());

    return <TagList tags={tags} tagList={tagList} />;
}

export default ComicsTagList;
