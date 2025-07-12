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
    let issues = 0;
    let issueFiles = 0;
    let monitored = 0;
    let totalFileSize = 0;

    volumes?.forEach((v) => {
        const { issue_count, issue_file_count, total_size } = v;

        issues += issue_count;
        issueFiles += issue_file_count;

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
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Monitored')}
                                    data={monitored}
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
