import { useCallback } from 'react';
// import { useSelector } from 'react-redux';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import { icons } from 'Helpers/Props';
// import createExistingVolumesSelector from 'Store/Selectors/createExistingVolumesSelector';
import ImportVolumesTitle from './ImportVolumesTitle';
import styles from './ImportVolumesSearchResult.module.css';

interface ImportVolumesSearchResultProps {
    tvdbId: number;
    title: string;
    year: number;
    network?: string;
    onPress: (tvdbId: number) => void;
}

function ImportVolumesSearchResult({
    tvdbId,
    title,
    year,
    network,
    onPress,
}: ImportVolumesSearchResultProps) {
    // const isExistingVolumes = useSelector(createExistingVolumesSelector(tvdbId));
    const isExistingVolumes = false;

    const handlePress = useCallback(() => {
        onPress(tvdbId);
    }, [tvdbId, onPress]);

    return (
        <div className={styles.container}>
            <Link className={styles.volumes} onPress={handlePress}>
                <ImportVolumesTitle
                    title={title}
                    year={year}
                    network={network}
                    isExistingVolumes={isExistingVolumes}
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

export default ImportVolumesSearchResult;
