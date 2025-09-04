// IMPORTS

// Redux
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
import type { Column } from 'Components/Table/Column';

// IMPLEMENTATIONS

const rootFolderColumns: Column<string>[] = [
    {
        name: 'path',
        label: () => translate('Path'),
        isVisible: true,
    },
    {
        name: 'freeSpace',
        label: () => translate('FreeSpace'),
        isVisible: true,
    },
    {
        name: 'unmappedFolders',
        label: () => translate('UnmappedFolders'),
        isVisible: true,
    },
    {
        name: 'actions',
        label: '',
        isVisible: true,
    },
];

export default function RootFolders() {
    const { isFetching, isUninitialized, error, data: items = [] } = useGetRootFoldersQuery();

    if (isFetching && isUninitialized) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return <Alert kind={kinds.DANGER}>{translate('RootFoldersLoadError')}</Alert>;
    }

    return (
        <Table columns={rootFolderColumns}>
            <TableBody>
                {items.map((rootFolder) => {
                    return (
                        <RootFolderRow
                            key={rootFolder.id}
                            id={rootFolder.id}
                            path={rootFolder.folder}
                            freeSpace={rootFolder.size.free}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
}
