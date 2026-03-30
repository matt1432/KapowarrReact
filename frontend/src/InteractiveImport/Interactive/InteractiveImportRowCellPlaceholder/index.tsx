// IMPORTS

// Misc
import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
interface InteractiveImportRowCellPlaceholderProps {
    isOptional?: boolean;
}

export default function InteractiveImportRowCellPlaceholder({
    isOptional,
}: InteractiveImportRowCellPlaceholderProps) {
    return (
        <span
            className={classNames(
                styles.placeholder,
                isOptional && styles.optional,
            )}
        />
    );
}
