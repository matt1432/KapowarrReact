// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// CSS
import styles from './MetadataAttribution.module.css';

// IMPLEMENTATIONS

export default function MetadataAttribution() {
    return (
        <div className={styles.container}>
            {translate('MetadataProvidedBy', { provider: 'ComicVine' })}
        </div>
    );
}
