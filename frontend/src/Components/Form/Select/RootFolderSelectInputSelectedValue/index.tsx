// IMPORTS

// Misc
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// Specific Components
import EnhancedSelectInputSelectedValue from '../EnhancedSelectInputSelectedValue';

// CSS
import styles from './index.module.css';

// Types
import type { RootFolderSelectInputValue } from '../RootFolderSelectInput';

interface RootFolderSelectInputSelectedValueProps {
    selectedValue: string;
    values: RootFolderSelectInputValue[];
    volumeFolder?: string;
}

// IMPLEMENTATIONS

export default function RootFolderSelectInputSelectedValue({
    selectedValue,
    values,
    volumeFolder,
    ...otherProps
}: RootFolderSelectInputSelectedValueProps) {
    const { value, freeSpace } =
        values.find((v) => v.key === selectedValue) ||
        ({} as RootFolderSelectInputValue);

    return (
        <EnhancedSelectInputSelectedValue
            className={styles.selectedValue}
            {...otherProps}
        >
            <div className={styles.pathContainer}>
                <div className={styles.path}>{value}</div>

                {volumeFolder ? (
                    <div className={styles.volumeFolder}>{volumeFolder}</div>
                ) : null}
            </div>

            {freeSpace ? (
                <div className={styles.freeSpace}>
                    {translate('RootFolderSelectFreeSpace', {
                        freeSpace: formatBytes(freeSpace),
                    })}
                </div>
            ) : null}
        </EnhancedSelectInputSelectedValue>
    );
}
