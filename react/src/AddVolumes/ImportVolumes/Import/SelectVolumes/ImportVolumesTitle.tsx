import Label from 'Components/Label';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './ImportVolumesTitle.module.css';

interface ImportVolumesTitleProps {
    title: string;
    year: number;
    network?: string;
    isExistingVolumes: boolean;
}

function ImportVolumesTitle({ title, year, network, isExistingVolumes }: ImportVolumesTitleProps) {
    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>{title}</div>

            {year > 0 && !title.includes(String(year)) ? (
                <span className={styles.year}>({year})</span>
            ) : null}

            {network ? <Label>{network}</Label> : null}

            {isExistingVolumes ? <Label kind={kinds.WARNING}>{translate('Existing')}</Label> : null}
        </div>
    );
}

export default ImportVolumesTitle;
