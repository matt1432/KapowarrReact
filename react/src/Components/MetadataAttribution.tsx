// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Link from 'Components/Link/Link';

// CSS
import styles from './MetadataAttribution.module.css';

// IMPLEMENTATIONS

export default function MetadataAttribution() {
    return (
        <div className={styles.container}>
            <Link className={styles.attribution} to="/settings/metadatasource">
                {translate('MetadataProvidedBy', { provider: 'TheTVDB' })}
            </Link>
        </div>
    );
}
