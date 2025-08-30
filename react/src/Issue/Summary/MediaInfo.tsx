// IMPORTS

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// IMPLEMENTATIONS

export default function MediaInfo(props: Record<string, string | undefined>) {
    return (
        <DescriptionList>
            {Object.entries(props).map(([key, value]) => {
                const title = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());

                if (!value) {
                    return null;
                }

                return <DescriptionListItem key={key} title={title} data={value} />;
            })}
        </DescriptionList>
    );
}
