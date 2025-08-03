// IMPORTS

// Misc
import classNames from 'classnames';

// Specific Components
import EnhancedSelectInputOption, {
    type EnhancedSelectInputOptionProps,
} from './EnhancedSelectInputOption';

// CSS
import styles from './SpecialVersionSelectInputOption.module.css';

// Types
interface SpecialVersionSelectInputOptionProps extends EnhancedSelectInputOptionProps {
    id: string;
    value: string;
    isMobile: boolean;
}

// IMPLEMENTATIONS

function SpecialVersionSelectInputOption({
    id,
    value,
    isMobile,
    ...otherProps
}: SpecialVersionSelectInputOptionProps) {
    return (
        <EnhancedSelectInputOption {...otherProps} id={id} isMobile={isMobile}>
            <div className={classNames(styles.optionText, isMobile && styles.isMobile)}>
                <div className={styles.value}>{value}</div>
            </div>
        </EnhancedSelectInputOption>
    );
}

export default SpecialVersionSelectInputOption;
