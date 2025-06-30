import { type ParseModel } from 'App/State/ParseAppState';
import FieldSet from 'Components/FieldSet';
import IssueFormats from 'Issue/IssueFormats';
import ComicsTitleLink from 'Comics/ComicsTitleLink';
import translate from 'Utilities/String/translate';
import ParseResultItem from './ParseResultItem';
import styles from './ParseResult.module.css';

interface ParseResultProps {
    item: ParseModel;
}

function ParseResult(props: ParseResultProps) {
    const { item } = props;
    const { customFormats, customFormatScore, episodes, languages, parsedIssueInfo, comics } = item;

    const {
        releaseTitle,
        comicsTitle,
        comicsTitleInfo,
        releaseGroup,
        releaseHash,
        seasonNumber,
        episodeNumbers,
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

                <ParseResultItem title={translate('ComicsTitle')} data={comicsTitle} />

                <ParseResultItem
                    title={translate('Year')}
                    data={comicsTitleInfo.year > 0 ? comicsTitleInfo.year : '-'}
                />

                <ParseResultItem
                    title={translate('AllTitles')}
                    data={
                        comicsTitleInfo.allTitles?.length > 0
                            ? comicsTitleInfo.allTitles.join(', ')
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
                            data={episodeNumbers.join(', ') || '-'}
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
                    title={translate('MatchedToComics')}
                    data={
                        comics ? (
                            <ComicsTitleLink titleSlug={comics.titleSlug} title={comics.title} />
                        ) : (
                            '-'
                        )
                    }
                />

                <ParseResultItem
                    title={translate('MatchedToSeason')}
                    data={episodes.length ? episodes[0].seasonNumber : '-'}
                />

                <ParseResultItem
                    title={translate('MatchedToIssues')}
                    data={
                        episodes.length ? (
                            <div>
                                {episodes.map((e) => {
                                    return (
                                        <div key={e.id}>
                                            {e.episodeNumber}
                                            {comics?.comicsType === 'anime' && e.absoluteIssueNumber
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
