import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import { icons } from 'Helpers/Props';
import createExistingComicsSelector from 'Store/Selectors/createExistingComicsSelector';
import ImportComicsTitle from './ImportComicsTitle';
import styles from './ImportComicsSearchResult.module.css';

interface ImportComicsSearchResultProps {
    tvdbId: number;
    title: string;
    year: number;
    network?: string;
    onPress: (tvdbId: number) => void;
}

function ImportComicsSearchResult({
    tvdbId,
    title,
    year,
    network,
    onPress,
}: ImportComicsSearchResultProps) {
    const isExistingComics = useSelector(createExistingComicsSelector(tvdbId));

    const handlePress = useCallback(() => {
        onPress(tvdbId);
    }, [tvdbId, onPress]);

    return (
        <div className={styles.container}>
            <Link className={styles.comics} onPress={handlePress}>
                <ImportComicsTitle
                    title={title}
                    year={year}
                    network={network}
                    isExistingComics={isExistingComics}
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

export default ImportComicsSearchResult;
