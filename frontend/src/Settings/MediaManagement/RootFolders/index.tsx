// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useGetRootFoldersQuery } from 'Store/Api/RootFolders';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import RootFolderRow from './RootFolderRow';

// Types
export type RootFolderColumnName =
    | 'path'
    | 'freeSpace'
    | 'totalSpace'
    | 'actions';

// IMPLEMENTATIONS

export default function RootFolders() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.rootFolders,
    );

    const {
        isFetching,
        isUninitialized,
        error,
        data: items = [],
    } = useGetRootFoldersQuery();

    if (isFetching && isUninitialized) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return (
            <Alert kind={kinds.DANGER}>
                {translate('RootFoldersLoadError')}
            </Alert>
        );
    }

    return (
        <Table tableName="rootFolders" columns={columns}>
            <TableBody>
                {items.map((rootFolder) => {
                    return (
                        <RootFolderRow
                            key={rootFolder.id}
                            id={rootFolder.id}
                            path={rootFolder.folder}
                            freeSpace={rootFolder.size.free}
                            totalSpace={rootFolder.size.total}
                            columns={columns}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
}
