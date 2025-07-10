import React, { useCallback, useState } from 'react';
// import { useSelector } from 'react-redux';
import { type AddVolumes } from 'AddVolumes/AddVolumes';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MetadataAttribution from 'Components/MetadataAttribution';
import { icons, kinds, sizes } from 'Helpers/Props';
import { type Statistics } from 'Volumes/Volumes';
import VolumesGenres from 'Volumes/VolumesGenres';
import VolumesPoster from 'Volumes/VolumesPoster';
// import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
// import createExistingVolumesSelector from 'Store/Selectors/createExistingVolumesSelector';
import translate from 'Utilities/String/translate';
import AddNewVolumesModal from './AddNewVolumesModal';
import styles from './AddNewVolumesSearchResult.module.css';

interface AddNewVolumesSearchResultProps {
    volumes: AddVolumes;
}

function AddNewVolumesSearchResult({ volumes }: AddNewVolumesSearchResultProps) {
    const {
        tvdbId,
        titleSlug,
        title,
        year,
        network,
        originalLanguage,
        genres = [],
        status,
        statistics = {} as Statistics,
        ratings,
        overview,
        volumesType,
        images,
    } = volumes;

    // const isExistingVolumes = useSelector(createExistingVolumesSelector(tvdbId));
    // const { isSmallScreen } = useSelector(createDimensionsSelector());
    const isExistingVolumes = false;
    const isSmallScreen = false;
    const [isNewAddVolumesModalOpen, setIsNewAddVolumesModalOpen] = useState(false);

    const seasonCount = statistics.seasonCount;
    const handlePress = useCallback(() => {
        setIsNewAddVolumesModalOpen(true);
    }, []);

    const handleAddVolumesModalClose = useCallback(() => {
        setIsNewAddVolumesModalOpen(false);
    }, []);

    const handleTvdbLinkPress = useCallback((event: React.SyntheticEvent) => {
        event.stopPropagation();
    }, []);

    const linkProps = isExistingVolumes
        ? { to: `/volumes/${titleSlug}` }
        : { onPress: handlePress };
    let seasons = translate('OneSeason');

    if (seasonCount > 1) {
        seasons = translate('CountSeasons', { count: seasonCount });
    }

    return (
        <div className={styles.searchResult}>
            <Link className={styles.underlay} {...linkProps} />

            <div className={styles.overlay}>
                {isSmallScreen ? null : (
                    <VolumesPoster
                        className={styles.poster}
                        images={images}
                        size={250}
                        // overflow={true} FIXME: see if necessary
                        lazy={false}
                    />
                )}

                <div className={styles.content}>
                    <div className={styles.titleRow}>
                        <div className={styles.titleContainer}>
                            <div className={styles.title}>
                                {title}

                                {!title.includes(String(year)) && year ? (
                                    <span className={styles.year}>({year})</span>
                                ) : null}
                            </div>
                        </div>

                        <div className={styles.icons}>
                            {isExistingVolumes ? (
                                <Icon
                                    className={styles.alreadyExistsIcon}
                                    name={icons.CHECK_CIRCLE}
                                    size={36}
                                    title={translate('AlreadyInYourLibrary')}
                                />
                            ) : null}

                            <Link
                                className={styles.tvdbLink}
                                to={`https://www.thetvdb.com/?tab=volumes&id=${tvdbId}`}
                                onPress={handleTvdbLinkPress}
                            >
                                <Icon
                                    className={styles.tvdbLinkIcon}
                                    name={icons.EXTERNAL_LINK}
                                    size={28}
                                />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Label size={sizes.LARGE}>
                            <HeartRating
                                rating={ratings.value}
                                votes={ratings.votes}
                                iconSize={13}
                            />
                        </Label>

                        {originalLanguage?.name ? (
                            <Label size={sizes.LARGE}>
                                <Icon name={icons.LANGUAGE} size={13} />

                                <span className={styles.originalLanguageName}>
                                    {originalLanguage.name}
                                </span>
                            </Label>
                        ) : null}

                        {network ? (
                            <Label size={sizes.LARGE}>
                                <Icon name={icons.NETWORK} size={13} />

                                <span className={styles.network}>{network}</span>
                            </Label>
                        ) : null}

                        {genres.length > 0 ? (
                            <Label size={sizes.LARGE}>
                                <Icon name={icons.GENRE} size={13} />
                                <VolumesGenres className={styles.genres} genres={genres} />
                            </Label>
                        ) : null}

                        {seasonCount ? <Label size={sizes.LARGE}>{seasons}</Label> : null}

                        {status === 'ended' ? (
                            <Label kind={kinds.DANGER} size={sizes.LARGE}>
                                {translate('Ended')}
                            </Label>
                        ) : null}

                        {status === 'upcoming' ? (
                            <Label kind={kinds.INFO} size={sizes.LARGE}>
                                {translate('Upcoming')}
                            </Label>
                        ) : null}
                    </div>

                    <div className={styles.overview}>{overview}</div>

                    <MetadataAttribution />
                </div>
            </div>

            <AddNewVolumesModal
                isOpen={isNewAddVolumesModalOpen && !isExistingVolumes}
                volumes={volumes}
                initialVolumesType={volumesType}
                onModalClose={handleAddVolumesModalClose}
            />
        </div>
    );
}

export default AddNewVolumesSearchResult;
