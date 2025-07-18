// IMPORTS

// React

// Redux

// Misc
import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import IssueFormats from 'Issue/IssueFormats';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

// Specific Components
import ParseResultItem from './ParseResultItem';

// CSS
import styles from './ParseResult.module.css';

// Types
interface ParseResultProps {
    // eslint-disable-next-line
    item: any; //ParseModel;
}

// IMPLEMENTATIONS

function ParseResult(props: ParseResultProps) {
    const { item } = props;
    const { customFormats, customFormatScore, issues, languages, parsedIssueInfo, volume } = item;

    const {
        releaseTitle,
        volumeTitle,
        volumeTitleInfo,
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

                <ParseResultItem title={translate('VolumeTitle')} data={volumeTitle} />

                <ParseResultItem
                    title={translate('Year')}
                    data={volumeTitleInfo.year > 0 ? volumeTitleInfo.year : '-'}
                />

                <ParseResultItem
                    title={translate('AllTitles')}
                    data={
                        volumeTitleInfo.allTitles?.length > 0
                            ? volumeTitleInfo.allTitles.join(', ')
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
                            title={translate('VolumeNumber')}
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
                    // @ts-expect-error TODO
                    data={finalLanguages.map((l) => l.name).join(', ')}
                />
            </FieldSet>

            <FieldSet legend={translate('Details')}>
                <ParseResultItem
                    title={translate('MatchedToVolume')}
                    data={
                        volume ? (
                            <VolumeTitleLink titleSlug={volume.titleSlug} title={volume.title} />
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
                                {/* @ts-expect-error TODO */}
                                {issues.map((e) => {
                                    return (
                                        <div key={e.id}>
                                            {e.issueNumber}
                                            {volume?.volumeType === 'anime' && e.absoluteIssueNumber
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
