// IMPORTS

// General Components
import VolumePoster from 'Volume/VolumePoster';

// CSS
import styles from './VolumeSearchResult.module.css';

// Types
import type { SuggestedVolume } from './VolumeSearchInput';

interface Match {
    key: string;
    refIndex: number;
}

interface VolumeSearchResultProps extends SuggestedVolume {
    match: Match;
}

// IMPLEMENTATIONS

function VolumeSearchResult({ match, title, comicvineId, id }: VolumeSearchResultProps) {
    return (
        <div className={styles.result}>
            <VolumePoster volume={{ id }} className={styles.poster} size={250} lazy={false} />

            <div className={styles.titles}>
                <div className={styles.title}>{title}</div>

                {match.key === 'comicvineId' && comicvineId ? (
                    <div className={styles.alternateTitle}>ComicVine ID: {comicvineId}</div>
                ) : null}
            </div>
        </div>
    );
}

export default VolumeSearchResult;
