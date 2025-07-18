// IMPORTS

// Misc
import classNames from 'classnames';

// Specific Components
import EnhancedSelectInputOption, {
    type EnhancedSelectInputOptionProps,
} from './EnhancedSelectInputOption';

// CSS
import styles from './VolumeTypeSelectInputOption.module.css';

// Types
interface VolumeTypeSelectInputOptionProps extends EnhancedSelectInputOptionProps {
    id: string;
    value: string;
    format: string;
    isMobile: boolean;
}

// IMPLEMENTATIONS

function VolumeTypeSelectInputOption(props: VolumeTypeSelectInputOptionProps) {
    const { id, value, format, isMobile, ...otherProps } = props;

    return (
        <EnhancedSelectInputOption {...otherProps} id={id} isMobile={isMobile}>
            <div className={classNames(styles.optionText, isMobile && styles.isMobile)}>
                <div className={styles.value}>{value}</div>

                {format == null ? null : <div className={styles.format}>{format}</div>}
            </div>
        </EnhancedSelectInputOption>
    );
}

export default VolumeTypeSelectInputOption;
