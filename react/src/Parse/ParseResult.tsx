import { type ParseModel } from 'App/State/ParseAppState';
import FieldSet from 'Components/FieldSet';
import IssueFormats from 'Issue/IssueFormats';
import VolumesTitleLink from 'Volumes/VolumesTitleLink';
import translate from 'Utilities/String/translate';
import ParseResultItem from './ParseResultItem';
import styles from './ParseResult.module.css';

interface ParseResultProps {
    item: ParseModel;
}

function ParseResult(props: ParseResultProps) {
    const { item } = props;
    const { customFormats, customFormatScore, issues, languages, parsedIssueInfo, volumes } = item;

    const {
        releaseTitle,
        volumesTitle,
        volumesTitleInfo,
        releaseGroup,
        releaseHash,
        seasonNumber,
        issueNumbers,
        absoluteIssueNumbers,
        special,
        fullSeason,
        isMultiSeason,
        isPartialSeason,
        isDaily,
        airDate,
        quality,
    } = parsedIssueInfo;

    const finalLanguages = languages ?? parsedIssueInfo.languages;

    return (
        <div>
            <FieldSet legend={translate('Release')}>
                <ParseResultItem title={translate('ReleaseTitle')} data={releaseTitle} />

                <ParseResultItem title={translate('VolumesTitle')} data={volumesTitle} />

                <ParseResultItem
                    title={translate('Year')}
                    data={volumesTitleInfo.year > 0 ? volumesTitleInfo.year : '-'}
                />

                <ParseResultItem
                    title={translate('AllTitles')}
                    data={
                        volumesTitleInfo.allTitles?.length > 0
                            ? volumesTitleInfo.allTitles.join(', ')
                            : '-'
                    }
                />

                <ParseResultItem title={translate('ReleaseGroup')} data={releaseGroup ?? '-'} />

                <ParseResultItem
                    title={translate('ReleaseHash')}
                    data={releaseHash ? releaseHash : '-'}
                />
            </FieldSet>

            <FieldSet legend={translate('IssueInfo')}>
                <div className={styles.container}>
                    <div className={styles.column}>
                        <ParseResultItem
                            title={translate('SeasonNumber')}
                            data={
                                seasonNumber === 0 && absoluteIssueNumbers.length
                                    ? '-'
                                    : seasonNumber
                            }
                        />

                        <ParseResultItem
                            title={translate('IssueNumbers')}
                            data={issueNumbers.join(', ') || '-'}
                        />

                        <ParseResultItem
                            title={translate('AbsoluteIssueNumbers')}
                            data={
                                absoluteIssueNumbers.length ? absoluteIssueNumbers.join(', ') : '-'
                            }
                        />

                        <ParseResultItem
                            title={translate('Daily')}
                            data={isDaily ? 'True' : 'False'}
                        />

                        <ParseResultItem title={translate('AirDate')} data={airDate ?? '-'} />
                    </div>

                    <div className={styles.column}>
                        <ParseResultItem
                            title={translate('Special')}
                            data={special ? translate('True') : translate('False')}
                        />

                        <ParseResultItem
                            title={translate('FullSeason')}
                            data={fullSeason ? translate('True') : translate('False')}
                        />

                        <ParseResultItem
                            title={translate('MultiSeason')}
                            data={isMultiSeason ? translate('True') : translate('False')}
                        />

                        <ParseResultItem
                            title={translate('PartialSeason')}
                            data={isPartialSeason ? translate('True') : translate('False')}
                        />
                    </div>
                </div>
            </FieldSet>

            <FieldSet legend={translate('Quality')}>
                <div className={styles.container}>
                    <div className={styles.column}>
                        <ParseResultItem title={translate('Quality')} data={quality.quality.name} />
                        <ParseResultItem
                            title={translate('Proper')}
                            data={
                                quality.revision.version > 1 && !quality.revision.isRepack
                                    ? translate('True')
                                    : '-'
                            }
                        />

                        <ParseResultItem
                            title={translate('Repack')}
                            data={quality.revision.isRepack ? translate('True') : '-'}
                        />
                    </div>

                    <div className={styles.column}>
                        <ParseResultItem
                            title={translate('Version')}
                            data={quality.revision.version > 1 ? quality.revision.version : '-'}
                        />

                        <ParseResultItem
                            title={translate('Real')}
                            data={quality.revision.real ? translate('True') : '-'}
                        />
                    </div>
                </div>
            </FieldSet>

            <FieldSet legend={translate('Languages')}>
                <ParseResultItem
                    title={translate('Languages')}
                    data={finalLanguages.map((l) => l.name).join(', ')}
                />
            </FieldSet>

            <FieldSet legend={translate('Details')}>
                <ParseResultItem
                    title={translate('MatchedToVolumes')}
                    data={
                        volumes ? (
                            <VolumesTitleLink titleSlug={volumes.titleSlug} title={volumes.title} />
                        ) : (
                            '-'
                        )
                    }
                />

                <ParseResultItem
                    title={translate('MatchedToSeason')}
                    data={issues.length ? issues[0].seasonNumber : '-'}
                />

                <ParseResultItem
                    title={translate('MatchedToIssues')}
                    data={
                        issues.length ? (
                            <div>
                                {issues.map((e) => {
                                    return (
                                        <div key={e.id}>
                                            {e.issueNumber}
                                            {volumes?.volumesType === 'anime' && e.absoluteIssueNumber
                                                ? ` (${e.absoluteIssueNumber})`
                                                : ''}{' '}
                                            {` - ${e.title}`}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            '-'
                        )
                    }
                />

                <ParseResultItem
                    title={translate('CustomFormats')}
                    data={customFormats?.length ? <IssueFormats formats={customFormats} /> : '-'}
                />

                <ParseResultItem title={translate('CustomFormatScore')} data={customFormatScore} />
            </FieldSet>
        </div>
    );
}

export default ParseResult;
