import classNames from 'classnames';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import EnhancedSelectInputOption, {
    type EnhancedSelectInputOptionProps,
} from './EnhancedSelectInputOption';
import styles from './RootFolderSelectInputOption.module.css';

interface RootFolderSelectInputOptionProps extends EnhancedSelectInputOptionProps {
    id: string;
    value: string;
    freeSpace?: number;
    isMissing?: boolean;
    volumesFolder?: string;
    isMobile: boolean;
    isWindows?: boolean;
}

function RootFolderSelectInputOption({
    id,
    value,
    freeSpace,
    isMissing,
    volumesFolder,
    isMobile,
    isWindows,
    ...otherProps
}: RootFolderSelectInputOptionProps) {
    const slashCharacter = isWindows ? '\\' : '/';

    return (
        <EnhancedSelectInputOption id={id} isMobile={isMobile} {...otherProps}>
            <div className={classNames(styles.optionText, isMobile && styles.isMobile)}>
                <div className={styles.value}>
                    {value}

                    {volumesFolder && id !== 'addNew' ? (
                        <div className={styles.volumesFolder}>
                            {slashCharacter}
                            {volumesFolder}
                        </div>
                    ) : null}
                </div>

                {freeSpace == null ? null : (
                    <div className={styles.freeSpace}>
                        {translate('RootFolderSelectFreeSpace', {
                            freeSpace: formatBytes(freeSpace),
                        })}
                    </div>
                )}

                {isMissing ? <div className={styles.isMissing}>{translate('Missing')}</div> : null}
            </div>
        </EnhancedSelectInputOption>
    );
}

export default RootFolderSelectInputOption;
