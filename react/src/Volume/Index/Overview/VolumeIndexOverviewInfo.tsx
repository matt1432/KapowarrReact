// IMPORTS

// React
import { useMemo } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';

// Misc
import { icons } from 'Helpers/Props';

import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components

// Specific Components
import VolumeIndexOverviewInfoRow from './VolumeIndexOverviewInfoRow';

// CSS
import dimensions from 'Styles/Variables/dimensions';
import styles from './VolumeIndexOverviewInfo.module.css';

// Types
import type { IconName } from 'Components/Icon';
import type { QualityProfile } from 'typings/QualityProfile';
import type { UiSettings } from 'typings/Settings/UiSettings';

interface RowProps {
    name: string;
    showProp: string;
    valueProp: string;
}

interface RowInfoProps {
    title: string;
    iconName: IconName;
    label: string;
}

interface VolumeIndexOverviewInfoProps {
    height: number;
    showNetwork: boolean;
    showMonitored: boolean;
    showQualityProfile: boolean;
    showPreviousAiring: boolean;
    showAdded: boolean;
    showSeasonCount: boolean;
    showPath: boolean;
    showSizeOnDisk: boolean;
    monitored: boolean;
    nextAiring?: string;
    network?: string;
    qualityProfile?: QualityProfile;
    previousAiring?: string;
    added?: string;
    seasonCount: number;
    path: string;
    sizeOnDisk?: number;
    sortKey: string;
}

// IMPLEMENTATIONS

const infoRowHeight = parseInt(dimensions.volumeIndexOverviewInfoRowHeight);

const rows = [
    {
        name: 'monitored',
        showProp: 'showMonitored',
        valueProp: 'monitored',
    },
    {
        name: 'network',
        showProp: 'showNetwork',
        valueProp: 'network',
    },
    {
        name: 'qualityProfileId',
        showProp: 'showQualityProfile',
        valueProp: 'qualityProfile',
    },
    {
        name: 'previousAiring',
        showProp: 'showPreviousAiring',
        valueProp: 'previousAiring',
    },
    {
        name: 'added',
        showProp: 'showAdded',
        valueProp: 'added',
    },
    {
        name: 'seasonCount',
        showProp: 'showSeasonCount',
        valueProp: 'seasonCount',
    },
    {
        name: 'path',
        showProp: 'showPath',
        valueProp: 'path',
    },
    {
        name: 'sizeOnDisk',
        showProp: 'showSizeOnDisk',
        valueProp: 'sizeOnDisk',
    },
];

// @ts-expect-error TODO
// eslint-disable-next-line
function getInfoRowProps(
    row: RowProps,
    props: VolumeIndexOverviewInfoProps,
    uiSettings: UiSettings,
): RowInfoProps | null {
    const { name } = row;

    if (name === 'monitored') {
        const monitoredText = props.monitored ? translate('Monitored') : translate('Unmonitored');

        return {
            title: monitoredText,
            iconName: props.monitored ? icons.MONITORED : icons.UNMONITORED,
            label: monitoredText,
        };
    }

    if (name === 'network') {
        return {
            title: translate('Network'),
            iconName: icons.NETWORK,
            label: props.network ?? '',
        };
    }

    if (name === 'qualityProfileId' && !!props.qualityProfile?.name) {
        return {
            title: translate('QualityProfile'),
            iconName: icons.PROFILE,
            label: props.qualityProfile.name,
        };
    }

    if (name === 'previousAiring') {
        const previousAiring = props.previousAiring;
        const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } = uiSettings;

        return {
            title: translate('PreviousAiringDate', {
                date: formatDateTime(previousAiring, longDateFormat, timeFormat),
            }),
            iconName: icons.CALENDAR,
            label: getRelativeDate({
                date: previousAiring,
                shortDateFormat,
                showRelativeDates,
                timeFormat,
                timeForToday: true,
            }),
        };
    }

    if (name === 'added') {
        const added = props.added;
        const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } = uiSettings;

        return {
            title: translate('AddedDate', {
                date: formatDateTime(added, longDateFormat, timeFormat),
            }),
            iconName: icons.ADD,
            label:
                getRelativeDate({
                    date: added,
                    shortDateFormat,
                    showRelativeDates,
                    timeFormat,
                    timeForToday: true,
                }) ?? '',
        };
    }

    if (name === 'seasonCount') {
        const { seasonCount } = props;
        let seasons = translate('OneSeason');

        if (seasonCount === 0) {
            seasons = translate('NoSeasons');
        }
        else if (seasonCount > 1) {
            seasons = translate('CountSeasons', { count: seasonCount });
        }

        return {
            title: translate('SeasonCount'),
            iconName: icons.CIRCLE,
            label: seasons,
        };
    }

    if (name === 'path') {
        return {
            title: translate('Path'),
            iconName: icons.FOLDER,
            label: props.path,
        };
    }

    if (name === 'sizeOnDisk') {
        const { sizeOnDisk = 0 } = props;

        return {
            title: translate('SizeOnDisk'),
            iconName: icons.DRIVE,
            label: formatBytes(sizeOnDisk),
        };
    }

    return null;
}

function VolumeIndexOverviewInfo(props: VolumeIndexOverviewInfoProps) {
    const { height, nextAiring } = props;

    // const uiSettings = useSelector(createUISettingsSelector());

    // const { shortDateFormat, showRelativeDates, longDateFormat, timeFormat } = uiSettings;
    const shortDateFormat = '';
    const showRelativeDates = true;
    const longDateFormat = '';
    const timeFormat = '';

    let shownRows = 1;
    const maxRows = Math.floor(height / (infoRowHeight + 4));

    const rowInfo = useMemo(() => {
        return rows.map((row) => {
            const { name, showProp, valueProp } = row;

            const isVisible =
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore ts(7053)
                props[valueProp] != null && (props[showProp] || props.sortKey === name);

            return {
                ...row,
                isVisible,
            };
        });
    }, [props]);

    return (
        <div className={styles.infos}>
            {!!nextAiring && (
                <VolumeIndexOverviewInfoRow
                    title={translate('NextAiringDate', {
                        date: formatDateTime(nextAiring, longDateFormat, timeFormat),
                    })}
                    iconName={icons.SCHEDULED}
                    label={getRelativeDate({
                        date: nextAiring,
                        shortDateFormat,
                        showRelativeDates,
                        timeFormat,
                        timeForToday: true,
                    })}
                />
            )}

            {rowInfo.map((row) => {
                if (!row.isVisible) {
                    return null;
                }

                if (shownRows >= maxRows) {
                    return null;
                }

                shownRows++;

                const infoRowProps = null; // getInfoRowProps(row, props, uiSettings);

                if (infoRowProps == null) {
                    return null;
                }

                return (
                    <VolumeIndexOverviewInfoRow
                        iconName="cube"
                        label=""
                        key={row.name} // {...infoRowProps}
                    />
                );
            })}
        </div>
    );
}

export default VolumeIndexOverviewInfo;
