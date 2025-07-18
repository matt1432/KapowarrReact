// IMPORTS

// React

// Redux

// Misc
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components

// Specific Components
import EnhancedSelectInputSelectedValue from './EnhancedSelectInputSelectedValue';

// CSS
import styles from './RootFolderSelectInputSelectedValue.module.css';

// Types
// import type { RootFolderSelectInputValue } from './RootFolderSelectInput';
// eslint-disable-next-line
type RootFolderSelectInputValue = any;

interface RootFolderSelectInputSelectedValueProps {
    selectedValue: string;
    values: RootFolderSelectInputValue[];
    volumeFolder?: string;
    isWindows?: boolean;
    includeFreeSpace?: boolean;
}

// IMPLEMENTATIONS

function RootFolderSelectInputSelectedValue({
    selectedValue,
    values,
    volumeFolder,
    includeFreeSpace = true,
    isWindows,
    ...otherProps
}: RootFolderSelectInputSelectedValueProps) {
    const slashCharacter = isWindows ? '\\' : '/';
    const { value, freeSpace, isMissing } =
        values.find((v) => v.key === selectedValue) || ({} as RootFolderSelectInputValue);

    return (
        <EnhancedSelectInputSelectedValue className={styles.selectedValue} {...otherProps}>
            <div className={styles.pathContainer}>
                <div className={styles.path}>{value}</div>

                {volumeFolder ? (
                    <div className={styles.volumeFolder}>
                        {slashCharacter}
                        {volumeFolder}
                    </div>
                ) : null}
            </div>

            {freeSpace != null && includeFreeSpace ? (
                <div className={styles.freeSpace}>
                    {translate('RootFolderSelectFreeSpace', {
                        freeSpace: formatBytes(freeSpace),
                    })}
                </div>
            ) : null}

            {isMissing ? <div className={styles.isMissing}>{translate('Missing')}</div> : null}
        </EnhancedSelectInputSelectedValue>
    );
}

export default RootFolderSelectInputSelectedValue;
