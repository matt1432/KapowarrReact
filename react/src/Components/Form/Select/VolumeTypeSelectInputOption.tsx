import classNames from 'classnames';
import EnhancedSelectInputOption, {
    type EnhancedSelectInputOptionProps,
} from './EnhancedSelectInputOption';
import styles from './VolumeTypeSelectInputOption.module.css';

interface VolumeTypeSelectInputOptionProps extends EnhancedSelectInputOptionProps {
    id: string;
    value: string;
    format: string;
    isMobile: boolean;
}

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
