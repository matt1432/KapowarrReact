import { useMemo } from 'react';
// import { type Season } from 'Volumes/Volumes';
import translate from 'Utilities/String/translate';
import SeasonPassSeason from './SeasonPassSeason';
import styles from './SeasonDetails.module.css';

interface SeasonDetailsProps {
    volumesId: number;
    // @ts-expect-error TODO:
    seasons: Season[];
}

function SeasonDetails(props: SeasonDetailsProps) {
    const { volumesId, seasons } = props;

    const latestSeasons = useMemo(() => {
        return seasons.slice(Math.max(seasons.length - 25, 0));
    }, [seasons]);

    return (
        <div className={styles.seasons}>
            {latestSeasons.map((season) => {
                const { seasonNumber, monitored, statistics, isSaving = false } = season;

                return (
                    <SeasonPassSeason
                        key={seasonNumber}
                        volumesId={volumesId}
                        seasonNumber={seasonNumber}
                        monitored={monitored}
                        statistics={statistics}
                        isSaving={isSaving}
                    />
                );
            })}

            {latestSeasons.length < seasons.length ? (
                <div className={styles.truncated}>{translate('SeasonPassTruncated')}</div>
            ) : null}
        </div>
    );
}

export default SeasonDetails;
