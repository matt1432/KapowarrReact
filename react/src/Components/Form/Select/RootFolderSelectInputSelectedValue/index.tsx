// IMPORTS

// Specific Components
import EnhancedSelectInputSelectedValue from '../EnhancedSelectInputSelectedValue';

// CSS
import styles from './index.module.css';

// Types
import type { EnhancedSelectInputValue } from '../EnhancedSelectInput';

interface RootFolderSelectInputSelectedValueProps {
    selectedValue: string;
    values: EnhancedSelectInputValue<string>[];
    volumeFolder?: string;
}

// IMPLEMENTATIONS

function RootFolderSelectInputSelectedValue({
    selectedValue,
    values,
    volumeFolder,
    ...otherProps
}: RootFolderSelectInputSelectedValueProps) {
    const { value } =
        values.find((v) => v.key === selectedValue) || ({} as EnhancedSelectInputValue<string>);

    return (
        <EnhancedSelectInputSelectedValue className={styles.selectedValue} {...otherProps}>
            <div className={styles.pathContainer}>
                <div className={styles.path}>{value}</div>

                {volumeFolder ? <div className={styles.volumeFolder}>{volumeFolder}</div> : null}
            </div>
        </EnhancedSelectInputSelectedValue>
    );
}

export default RootFolderSelectInputSelectedValue;
