import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ColorImpairedConsumer } from 'App/ColorImpairedContext';
import { type VolumesAppState } from 'App/State/VolumesAppState';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import createDeepEqualSelector from 'Store/Selectors/createDeepEqualSelector';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './VolumesIndexFooter.module.css';

function createUnoptimizedSelector() {
    return createSelector(
        createClientSideCollectionSelector('volumes', 'volumesIndex'),
        (volumes: VolumesAppState) => {
            return volumes.items.map((s) => {
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

function createVolumesSelector() {
    return createDeepEqualSelector(createUnoptimizedSelector(), (volumes) => volumes);
}

export default function VolumesIndexFooter() {
    const volumes = useSelector(createVolumesSelector());
    const count = volumes.length;
    let issues = 0;
    let issueFiles = 0;
    let ended = 0;
    let continuing = 0;
    let monitored = 0;
    let totalFileSize = 0;

    volumes.forEach((s) => {
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
                                <div>{translate('VolumesIndexFooterContinuing')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.ended,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('VolumesIndexFooterEnded')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingMonitored,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('VolumesIndexFooterMissingMonitored')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingUnmonitored,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('VolumesIndexFooterMissingUnmonitored')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.downloading,
                                        enableColorImpairedMode && 'colorImpaired',
                                    )}
                                />
                                <div>{translate('VolumesIndexFooterDownloading')}</div>
                            </div>
                        </div>

                        <div className={styles.statistics}>
                            <DescriptionList>
                                <DescriptionListItem title={translate('Volumes')} data={count} />

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
