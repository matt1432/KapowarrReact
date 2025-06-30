import Label from 'Components/Label';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './ImportComicsTitle.module.css';

interface ImportComicsTitleProps {
    title: string;
    year: number;
    network?: string;
    isExistingComics: boolean;
}

function ImportComicsTitle({ title, year, network, isExistingComics }: ImportComicsTitleProps) {
    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>{title}</div>

            {year > 0 && !title.includes(String(year)) ? (
                <span className={styles.year}>({year})</span>
            ) : null}

            {network ? <Label>{network}</Label> : null}

            {isExistingComics ? <Label kind={kinds.WARNING}>{translate('Existing')}</Label> : null}
        </div>
    );
}

export default ImportComicsTitle;
