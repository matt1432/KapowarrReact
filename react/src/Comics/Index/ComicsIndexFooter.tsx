import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ColorImpairedConsumer } from 'App/ColorImpairedContext';
import { type ComicsAppState } from 'App/State/ComicsAppState';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import createDeepEqualSelector from 'Store/Selectors/createDeepEqualSelector';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './ComicsIndexFooter.module.css';

function createUnoptimizedSelector() {
    return createSelector(
        createClientSideCollectionSelector('comics', 'comicsIndex'),
        (comics: ComicsAppState) => {
            return comics.items.map((s) => {
                const { monitored, status, statistics } = s;

                return {
                    monitored,
                    status,
                    statistics,
                };
            });
        },
    );
}

function createComicsSelector() {
    return createDeepEqualSelector(createUnoptimizedSelector(), (comics) => comics);
}

export default function ComicsIndexFooter() {
    const comics = useSelector(createComicsSelector());
    const count = comics.length;
    let issues = 0;
    let issueFiles = 0;
    let ended = 0;
    let continuing = 0;
    let monitored = 0;
    let totalFileSize = 0;

    comics.forEach((s) => {
        const { statistics = { issueCount: 0, issueFileCount: 0, sizeOnDisk: 0 } } = s;

        const { issueCount = 0, issueFileCount = 0, sizeOnDisk = 0 } = statistics;

        issues += issueCount;
        issueFiles += issueFileCount;

        if (s.status === 'ended') {
            ended++;
        }
        else {
            continuing++;
        }

        if (s.monitored) {
            monitored++;
        }

        totalFileSize += sizeOnDisk;
    });

    return (
        <ColorImpairedConsumer>
            {(enableColorImpairedMode) => {
                return (
                    <div className={styles.footer}>
                        <div>
                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.continuing,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('ComicsIndexFooterContinuing')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.ended,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('ComicsIndexFooterEnded')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingMonitored,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('ComicsIndexFooterMissingMonitored')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingUnmonitored,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('ComicsIndexFooterMissingUnmonitored')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.downloading,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('ComicsIndexFooterDownloading')}</div>
                            </div>
                        </div>

                        <div className={styles.statistics}>
                            <DescriptionList>
                                <DescriptionListItem title={translate('Comics')} data={count} />

                                <DescriptionListItem title={translate('Ended')} data={ended} />

                                <DescriptionListItem
                                    title={translate('Continuing')}
                                    data={continuing}
                                />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Monitored')}
                                    data={monitored}
                                />

                                <DescriptionListItem
                                    title={translate('Unmonitored')}
                                    data={count - monitored}
                                />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem title={translate('Issues')} data={issues} />

                                <DescriptionListItem title={translate('Files')} data={issueFiles} />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('TotalFileSize')}
                                    data={formatBytes(totalFileSize)}
                                />
                            </DescriptionList>
                        </div>
                    </div>
                );
            }}
        </ColorImpairedConsumer>
    );
}
