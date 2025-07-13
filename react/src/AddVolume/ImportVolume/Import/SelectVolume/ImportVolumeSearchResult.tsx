import { useCallback } from 'react';
// import { useSelector } from 'react-redux';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import { icons } from 'Helpers/Props';
// import createExistingVolumeSelector from 'Store/Selectors/createExistingVolumeSelector';
import ImportVolumeTitle from './ImportVolumeTitle';
import styles from './ImportVolumeSearchResult.module.css';

interface ImportVolumeSearchResultProps {
    tvdbId: number;
    title: string;
    year: number;
    network?: string;
    onPress: (tvdbId: number) => void;
}

function ImportVolumeSearchResult({
    tvdbId,
    title,
    year,
    network,
    onPress,
}: ImportVolumeSearchResultProps) {
    // const isExistingVolume = useSelector(createExistingVolumeSelector(tvdbId));
    const isExistingVolume = false;

    const handlePress = useCallback(() => {
        onPress(tvdbId);
    }, [tvdbId, onPress]);

    return (
        <div className={styles.container}>
            <Link className={styles.volume} onPress={handlePress}>
                <ImportVolumeTitle
                    title={title}
                    year={year}
                    network={network}
                    isExistingVolume={isExistingVolume}
                />
            </Link>

            <Link
                className={styles.tvdbLink}
                to={`https://www.thetvdb.com/?tab=series&id=${tvdbId}`}
            >
                <Icon className={styles.tvdbLinkIcon} name={icons.EXTERNAL_LINK} size={16} />
            </Link>
        </div>
    );
}

export default ImportVolumeSearchResult;
