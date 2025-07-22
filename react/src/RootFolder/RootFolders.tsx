// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
// import createRootFoldersSelector from 'Store/Selectors/createRootFoldersSelector';

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

// FIXME: set a better type
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

function RootFolders() {
    // const { isFetching, isPopulated, error, items } = useSelector(createRootFoldersSelector());

    const isFetching = false;
    const isPopulated = false;
    const error = undefined;
    // @ts-expect-error TODO
    const items = [];

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(fetchRootFolders());
    }, [dispatch]);

    if (isFetching && !isPopulated) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return <Alert kind={kinds.DANGER}>{translate('RootFoldersLoadError')}</Alert>;
    }

    return (
        <Table columns={rootFolderColumns}>
            <TableBody>
                {/* @ts-expect-error TODO */}
                {items.map((rootFolder) => {
                    return (
                        <RootFolderRow
                            key={rootFolder.id}
                            id={rootFolder.id}
                            path={rootFolder.path}
                            accessible={rootFolder.accessible}
                            freeSpace={rootFolder.freeSpace}
                            unmappedFolders={rootFolder.unmappedFolders}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default RootFolders;
