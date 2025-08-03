// TODO:
// IMPORTS

// React

// Redux

// Misc
import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
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

function ParseResult({ item }: ParseResultProps) {
    const { issues, parsedIssueInfo, volume } = item;

    const {
        releaseTitle,
        volumeTitle,
        volumeTitleInfo,
        releaseGroup,
        releaseHash,
        issueNumbers,
        absoluteIssueNumbers,
        special,
        isDaily,
        quality,
    } = parsedIssueInfo;

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
                    </div>

                    <div className={styles.column}>
                        <ParseResultItem
                            title={translate('Special')}
                            data={special ? translate('True') : translate('False')}
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
                    title={translate('MatchedToIssues')}
                    data={
                        issues.length ? (
                            <div>
                                {/* @ts-expect-error idk */}
                                {issues.map((e) => {
                                    return (
                                        <div key={e.id}>
                                            {e.issueNumber}
                                            {volume?.specialVersion === 'anime' &&
                                            e.absoluteIssueNumber
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
            </FieldSet>
        </div>
    );
}

export default ParseResult;
