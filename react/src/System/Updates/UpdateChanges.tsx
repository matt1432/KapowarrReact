// IMPORTS

// General Components
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';

// CSS
import styles from './UpdateChanges.module.css';

// Types
interface UpdateChangesProps {
    title: string;
    changes: string[];
}

// IMPLEMENTATIONS

function UpdateChanges(props: UpdateChangesProps) {
    const { title, changes } = props;

    if (changes.length === 0) {
        return null;
    }

    return (
        <div>
            <div className={styles.title}>{title}</div>
            <ul>
                {changes.map((change, index) => {
                    return (
                        <li key={index}>
                            <InlineMarkdown data={change} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default UpdateChanges;
