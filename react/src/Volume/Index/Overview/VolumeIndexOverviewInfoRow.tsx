import Icon, { type IconName } from 'Components/Icon';
import styles from './VolumeIndexOverviewInfoRow.module.css';

interface VolumeIndexOverviewInfoRowProps {
    title?: string;
    iconName: IconName;
    label: string | null;
}

function VolumeIndexOverviewInfoRow(props: VolumeIndexOverviewInfoRowProps) {
    const { title, iconName, label } = props;

    return (
        <div className={styles.infoRow} title={title}>
            <Icon className={styles.icon} name={iconName} size={14} />

            {label}
        </div>
    );
}

export default VolumeIndexOverviewInfoRow;
