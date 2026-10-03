// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useGetBackupsQuery } from 'Store/Api/Status';

// Misc
import { icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageSectionContent from 'Components/Page/PageSectionContent';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import BackupRow from './BackupRow';
import UploadDatabaseModal from './UploadDatabaseModal';

// IMPLEMENTATIONS

export default function Backups() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.backupsTable,
    );

    const {
        data: items = [],
        error,
        isFetching,
        isUninitialized,
        refetch,
    } = useGetBackupsQuery();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleDownloadPress = useCallback(() => {
        window.location.href = `${window.Kapowarr.urlBase}/api/system/database?api_key=${window.Kapowarr.apiKey}`;
    }, []);

    const handleUploadPress = useCallback(() => {
        setIsUploadModalOpen(true);
    }, []);

    const handleUploadModalClose = useCallback(() => {
        setIsUploadModalOpen(false);
    }, []);

    return (
        <PageContent title={translate('Backups')}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        iconName={icons.REFRESH}
                        label={translate('Refresh')}
                        isSpinning={isFetching}
                        onPress={refetch}
                    />

                    <PageToolbarButton
                        iconName={icons.DOWNLOAD}
                        label={translate('DownloadDatabase')}
                        onPress={handleDownloadPress}
                    />

                    <PageToolbarButton
                        iconName={icons.UPLOAD}
                        label={translate('UploadDatabase')}
                        onPress={handleUploadPress}
                    />
                </PageToolbarSection>
            </PageToolbar>

            <PageContentBody>
                <PageSectionContent
                    errorMessage={translate('BackupsLoadError')}
                    error={error}
                    isFetching={isFetching && isUninitialized}
                    isPopulated={!isUninitialized}
                >
                    {items.length === 0 ? (
                        <Alert kind={kinds.INFO}>
                            {translate('NoBackups')}
                        </Alert>
                    ) : (
                        <Table tableName="backupsTable" columns={columns}>
                            <TableBody>
                                {items.map((item) => (
                                    <BackupRow key={item.index} {...item} />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </PageSectionContent>
            </PageContentBody>

            <UploadDatabaseModal
                isOpen={isUploadModalOpen}
                onModalClose={handleUploadModalClose}
            />
        </PageContent>
    );
}
