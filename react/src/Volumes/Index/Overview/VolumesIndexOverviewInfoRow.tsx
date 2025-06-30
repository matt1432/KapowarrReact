import Icon, { type IconName } from 'Components/Icon';
import styles from './VolumesIndexOverviewInfoRow.module.css';

interface VolumesIndexOverviewInfoRowProps {
    title?: string;
    iconName: IconName;
    label: string | null;
}

function VolumesIndexOverviewInfoRow(props: VolumesIndexOverviewInfoRowProps) {
    const { title, iconName, label } = props;

    return (
        <div className={styles.infoRow} title={title}>
            <Icon className={styles.icon} name={iconName} size={14} />

            {label}
        </div>
    );
}

export default VolumesIndexOverviewInfoRow;
