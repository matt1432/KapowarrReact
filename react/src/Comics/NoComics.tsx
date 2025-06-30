import Button from 'Components/Link/Button';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './NoComics.module.css';

interface NoComicsProps {
    totalItems: number;
}

function NoComics(props: NoComicsProps) {
    const { totalItems } = props;

    if (totalItems > 0) {
        return (
            <div>
                <div className={styles.message}>
                    {translate('AllComicsAreHiddenByTheAppliedFilter')}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.message}>{translate('NoComicsFoundImportOrAdd')}</div>

            <div className={styles.buttonContainer}>
                <Button to="/add/import" kind={kinds.PRIMARY}>
                    {translate('ImportExistingComics')}
                </Button>
            </div>

            <div className={styles.buttonContainer}>
                <Button to="/add/new" kind={kinds.PRIMARY}>
                    {translate('AddNewComics')}
                </Button>
            </div>
        </div>
    );
}

export default NoComics;
