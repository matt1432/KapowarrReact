// IMPORTS

// React

// Redux

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';

// Specific Components

// CSS
import styles from './NoVolume.module.css';

// Types
interface NoVolumeProps {
    totalItems: number;
}

// IMPLEMENTATIONS

function NoVolume(props: NoVolumeProps) {
    const { totalItems } = props;

    if (totalItems > 0) {
        return (
            <div>
                <div className={styles.message}>
                    {translate('AllVolumeAreHiddenByTheAppliedFilter')}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.message}>{translate('NoVolumeFoundImportOrAdd')}</div>

            <div className={styles.buttonContainer}>
                <Button to="/add/import" kind={kinds.PRIMARY}>
                    {translate('ImportExistingVolume')}
                </Button>
            </div>

            <div className={styles.buttonContainer}>
                <Button to="/add/new" kind={kinds.PRIMARY}>
                    {translate('AddNewVolume')}
                </Button>
            </div>
        </div>
    );
}

export default NoVolume;
