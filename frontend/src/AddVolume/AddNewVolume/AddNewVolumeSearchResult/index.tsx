// IMPORTS

// React
import React, { useCallback, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import InnerHTML from 'Components/InnerHTML';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MetadataAttribution from 'Components/MetadataAttribution';
import VolumePoster from 'Volume/VolumePoster';

// Specific Components
import AddNewVolumeModal from '../AddNewVolumeModal';

// CSS
import styles from './index.module.css';

// Types
import type { AddVolume } from 'AddVolume/AddVolume';

interface AddNewVolumeSearchResultProps {
    volume: AddVolume;
}

// IMPLEMENTATIONS

export default function AddNewVolumeSearchResult({ volume }: AddNewVolumeSearchResultProps) {
    const { comicvineId, title, description, publisher, year, siteUrl } = volume;

    const { isExistingVolume, titleSlug } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => {
            const existingVolume = data?.find((v) => v.comicvineId === comicvineId);

            if (!existingVolume) {
                return {
                    isExistingVolume: false,
                    titleSlug: undefined,
                };
            }

            return {
                isExistingVolume: true,
                titleSlug: existingVolume.id,
            };
        },
    });

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);
    const [isNewAddVolumeModalOpen, setIsNewAddVolumeModalOpen] = useState(false);

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
                                className={styles.comicvineLink}
                                to={siteUrl}
                                onPress={handleTvdbLinkPress}
                            >
                                <Icon
                                    className={styles.comicvineLinkIcon}
                                    name={icons.EXTERNAL_LINK}
                                    size={28}
                                />
                            </Link>
                        </div>
                    </div>

                    <div>
                        {publisher ? (
                            <Label size={sizes.LARGE}>
                                <Icon name={icons.PUBLISHER} size={13} />

                                <span className={styles.network}>{publisher}</span>
                            </Label>
                        ) : null}
                    </div>

                    <div className={styles.overview}>
                        <InnerHTML innerHTML={description} />
                    </div>

                    <MetadataAttribution />
                </div>
            </div>

            <AddNewVolumeModal
                isOpen={isNewAddVolumeModalOpen && !isExistingVolume}
                volume={volume}
                onModalClose={handleAddVolumeModalClose}
            />
        </div>
    );
}
