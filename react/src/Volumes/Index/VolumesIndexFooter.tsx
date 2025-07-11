import classNames from 'classnames';
import { ColorImpairedConsumer } from 'App/ColorImpairedContext';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './VolumesIndexFooter.module.css';
import { useGetVolumesQuery } from 'Store/createApiEndpoints';

export default function VolumesIndexFooter() {
    const { data: volumes } = useGetVolumesQuery();
    const count = volumes?.length;
    let issuesQty = 0;
    let issueFiles = 0;
    // let ended = 0;
    // let continuing = 0;
    let monitored = 0;
    let totalFileSize = 0;

    volumes?.forEach((v) => {
        const { issues, total_size } = v;

        issuesQty += issues.length;
        issueFiles += issues.reduce((acc, issue) => acc + issue.files.length, 0);

        // TODO
        /*
        if (v.status === 'ended') {
            ended++;
        }
        else {
            continuing++;
        }
        */

        if (v.monitored) {
            monitored++;
        }

        totalFileSize += total_size;
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

                                {/*
                                <DescriptionListItem title={translate('Ended')} data={ended} />

                                <DescriptionListItem
                                    title={translate('Continuing')}
                                    data={continuing}
                                />
                                */}
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Monitored')}
                                    data={monitored}
                                />

                                {/*
                                <DescriptionListItem
                                    title={translate('Unmonitored')}
                                    data={count - monitored}
                                />
                                */}
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem title={translate('Issues')} data={issuesQty} />

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
