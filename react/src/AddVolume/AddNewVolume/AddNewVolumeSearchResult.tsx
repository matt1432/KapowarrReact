// IMPORTS

// React
import React, { useCallback, useState } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
// import createExistingVolumeSelector from 'Store/Selectors/createExistingVolumeSelector';

// Misc
import { icons, kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MetadataAttribution from 'Components/MetadataAttribution';
import VolumePoster from 'Volume/VolumePoster';

// Specific Components
import AddNewVolumeModal from './AddNewVolumeModal';

// CSS
import styles from './AddNewVolumeSearchResult.module.css';

// Types
import type { AddVolume } from 'AddVolume/AddVolume';
// import type { Statistics } from 'Volume/Volume';

interface AddNewVolumeSearchResultProps {
    volume: AddVolume;
}

// IMPLEMENTATIONS

function AddNewVolumeSearchResult({ volume }: AddNewVolumeSearchResultProps) {
    const {
        // @ts-expect-error TODO:
        tvdbId,
        // @ts-expect-error TODO:
        titleSlug,
        title,
        year,
        // @ts-expect-error TODO:
        network,
        // @ts-expect-error TODO:
        originalLanguage,
        // @ts-expect-error TODO:
        status,
        // @ts-expect-error TODO:
        statistics = {} as Statistics,
        // @ts-expect-error TODO:
        ratings,
        // @ts-expect-error TODO:
        overview,
        // @ts-expect-error TODO:
        volumeType,
        // images,
    } = volume;

    // const isExistingVolume = useSelector(createExistingVolumeSelector(tvdbId));
    // const { isSmallScreen } = useSelector(createDimensionsSelector());
    const isExistingVolume = false;
    const isSmallScreen = false;
    const [isNewAddVolumeModalOpen, setIsNewAddVolumeModalOpen] = useState(false);

    const seasonCount = statistics.seasonCount;
    const handlePress = useCallback(() => {
        setIsNewAddVolumeModalOpen(true);
    }, []);

    const handleAddVolumeModalClose = useCallback(() => {
        setIsNewAddVolumeModalOpen(false);
    }, []);

    const handleTvdbLinkPress = useCallback((event: React.SyntheticEvent) => {
        event.stopPropagation();
    }, []);

    const linkProps = isExistingVolume ? { to: `/volumes/${titleSlug}` } : { onPress: handlePress };
    let seasons = translate('OneSeason');

    if (seasonCount > 1) {
        seasons = translate('CountSeasons', { count: seasonCount });
    }

    return (
        <div className={styles.searchResult}>
            <Link className={styles.underlay} {...linkProps} />

            <div className={styles.overlay}>
                {isSmallScreen ? null : (
                    <VolumePoster
                        volume={volume}
                        className={styles.poster}
                        size={250}
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
                            {isExistingVolume ? (
                                <Icon
                                    className={styles.alreadyExistsIcon}
                                    name={icons.CHECK_CIRCLE}
                                    size={36}
                                    title={translate('AlreadyInYourLibrary')}
                                />
                            ) : null}

                            <Link
                                className={styles.tvdbLink}
                                to={`https://www.thetvdb.com/?tab=volume&id=${tvdbId}`}
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

            <AddNewVolumeModal
                isOpen={isNewAddVolumeModalOpen && !isExistingVolume}
                volume={volume}
                initialVolumeType={volumeType}
                onModalClose={handleAddVolumeModalClose}
            />
        </div>
    );
}

export default AddNewVolumeSearchResult;
