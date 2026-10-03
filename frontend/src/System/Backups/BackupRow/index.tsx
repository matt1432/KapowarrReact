// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components
import ImportBackupModal from '../ImportBackupModal';

// CSS
import styles from './index.module.css';

// Types
import type { DatabaseBackup } from 'typings/Status';

// IMPLEMENTATIONS

export default function BackupRow({
    index,
    filename,
    creationDate,
}: DatabaseBackup) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.backupsTable,
    );

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleImportPress = useCallback(() => {
        setIsImportModalOpen(true);
    }, []);

    const handleImportModalClose = useCallback(() => {
        setIsImportModalOpen(false);
    }, []);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'filename') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {filename}
                        </TableRowCell>
                    );
                }

                if (name === 'creationDate') {
                    return (
                        <RelativeDateCell
                            key={name}
                            className={styles[name]}
                            date={creationDate * 1000}
                            includeTime
                        />
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <IconButton
                                name={icons.DOWNLOAD}
                                title={translate('DownloadDatabaseBackup')}
                                to={`/api/system/database/backups/${index}?api_key=${window.Kapowarr.apiKey}`}
                                target="_blank"
                            />

                            <IconButton
                                name={icons.UPLOAD}
                                title={translate('ImportDatabaseBackup')}
                                onPress={handleImportPress}
                            />

                            <ImportBackupModal
                                isOpen={isImportModalOpen}
                                index={index}
                                filename={filename}
                                creationDate={creationDate}
                                onModalClose={handleImportModalClose}
                            />
                        </TableRowCell>
                    );
                }

                return null;
            })}
        </TableRow>
    );
}
