// IMPORTS

// Redux
import { useGetStatsQuery } from 'Store/Api/Volumes';

// Misc
import classNames from 'classnames';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import { ColorImpairedConsumer } from 'App/ColorImpairedContext';

import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function VolumeIndexFooter() {
    const { data: stats } = useGetStatsQuery();

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
                                        enableColorImpairedMode &&
                                            'colorImpaired',
                                    )}
                                />
                                <div>
                                    {translate('VolumeIndexFooterContinuing')}
                                </div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.ended,
                                        enableColorImpairedMode &&
                                            'colorImpaired',
                                    )}
                                />
                                <div>{translate('VolumeIndexFooterEnded')}</div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingMonitored,
                                        enableColorImpairedMode &&
                                            'colorImpaired',
                                    )}
                                />
                                <div>
                                    {translate(
                                        'VolumeIndexFooterMissingMonitored',
                                    )}
                                </div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.missingUnmonitored,
                                        enableColorImpairedMode &&
                                            'colorImpaired',
                                    )}
                                />
                                <div>
                                    {translate(
                                        'VolumeIndexFooterMissingUnmonitored',
                                    )}
                                </div>
                            </div>

                            <div className={styles.legendItem}>
                                <div
                                    className={classNames(
                                        styles.downloading,
                                        enableColorImpairedMode &&
                                            'colorImpaired',
                                    )}
                                />
                                <div>
                                    {translate('VolumeIndexFooterDownloading')}
                                </div>
                            </div>
                        </div>

                        <div className={styles.statistics}>
                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Volumes')}
                                    data={stats?.volumes ?? 0}
                                />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Monitored')}
                                    data={stats?.monitored ?? 0}
                                />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('Issues')}
                                    data={stats?.issues ?? 0}
                                />

                                <DescriptionListItem
                                    title={translate('Files')}
                                    data={stats?.files ?? 0}
                                />
                            </DescriptionList>

                            <DescriptionList>
                                <DescriptionListItem
                                    title={translate('TotalFileSize')}
                                    data={formatBytes(
                                        stats?.totalFileSize ?? 0,
                                    )}
                                />
                            </DescriptionList>
                        </div>
                    </div>
                );
            }}
        </ColorImpairedConsumer>
    );
}
