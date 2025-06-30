import Icon, { type IconName } from 'Components/Icon';
import styles from './ComicsIndexOverviewInfoRow.module.css';

interface ComicsIndexOverviewInfoRowProps {
    title?: string;
    iconName: IconName;
    label: string | null;
}

function ComicsIndexOverviewInfoRow(props: ComicsIndexOverviewInfoRowProps) {
    const { title, iconName, label } = props;

    return (
        <div className={styles.infoRow} title={title}>
            <Icon className={styles.icon} name={iconName} size={14} />

            {label}
        </div>
    );
}

export default ComicsIndexOverviewInfoRow;
