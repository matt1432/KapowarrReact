// TODO:
// IMPORTS

// Misc
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// General Components
import Label from 'Components/Label';

// CSS
import styles from './ImportVolumeTitle.module.css';

// Types
interface ImportVolumeTitleProps {
    title: string;
    year: number;
    network?: string;
    isExistingVolume: boolean;
}

// IMPLEMENTATIONS

function ImportVolumeTitle({ title, year, network, isExistingVolume }: ImportVolumeTitleProps) {
    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>{title}</div>

            {year > 0 && !title.includes(String(year)) ? (
                <span className={styles.year}>({year})</span>
            ) : null}

            {network ? <Label>{network}</Label> : null}

            {isExistingVolume ? <Label kind={kinds.WARNING}>{translate('Existing')}</Label> : null}
        </div>
    );
}

export default ImportVolumeTitle;
