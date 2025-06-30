import Button from 'Components/Link/Button';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './NoVolumes.module.css';

interface NoVolumesProps {
    totalItems: number;
}

function NoVolumes(props: NoVolumesProps) {
    const { totalItems } = props;

    if (totalItems > 0) {
        return (
            <div>
                <div className={styles.message}>
                    {translate('AllVolumesAreHiddenByTheAppliedFilter')}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.message}>{translate('NoVolumesFoundImportOrAdd')}</div>

            <div className={styles.buttonContainer}>
                <Button to="/add/import" kind={kinds.PRIMARY}>
                    {translate('ImportExistingVolumes')}
                </Button>
            </div>

            <div className={styles.buttonContainer}>
                <Button to="/add/new" kind={kinds.PRIMARY}>
                    {translate('AddNewVolumes')}
                </Button>
            </div>
        </div>
    );
}

export default NoVolumes;
