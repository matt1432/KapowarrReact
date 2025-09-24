// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import {
    useAddCredentialMutation,
    useDeleteCredentialMutation,
    useGetCredentialsQuery,
    type AddCredentialParams,
} from 'Store/Api/DownloadClients';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import CredentialRow from './CredentialRow';
import InputRow from './InputRow';

// Types
import type { Column } from 'Components/Table/Column';
import type { CredentialData, CredentialSource } from 'typings/DownloadClient';

interface CredentialTableProps {
    source: CredentialSource;
    showUsername?: boolean;
    showEmail?: boolean;
    showPassword?: boolean;
    showApiKey?: boolean;
}

// IMPLEMENTATIONS

export default function CredentialTable({
    source,
    showUsername = false,
    showEmail = false,
    showPassword = false,
    showApiKey = false,
}: CredentialTableProps) {
    const columns: Column<keyof CredentialData | 'actions'>[] = [
        {
            name: 'email',
            label: 'Email',
            isVisible: showEmail,
        },
        {
            name: 'username',
            label: () => translate('Username'),
            isVisible: showUsername,
        },
        {
            name: 'password',
            label: () => translate('Password'),
            isVisible: showPassword,
        },
        {
            name: 'apiKey',
            label: () => translate('ApiKey'),
            isVisible: showApiKey,
        },
        {
            name: 'actions',
            label: '',
            isVisible: true,
        },
    ];

    const { data, refetch } = useGetCredentialsQuery();
    const items = useMemo(
        () => data?.filter((c) => c.source === source) ?? [],
        [data, source],
    );

    const [addCredential] = useAddCredentialMutation();
    const onAddPress = useCallback(
        (data: AddCredentialParams) => {
            addCredential(data).finally(() => {
                refetch();
            });
        },
        [addCredential, refetch],
    );

    const [deleteCredential] = useDeleteCredentialMutation();
    const onDeletePress = useCallback(
        (id: number) => () => {
            deleteCredential({ id }).finally(() => {
                refetch();
            });
        },
        [deleteCredential, refetch],
    );

    return (
        <Table columns={columns}>
            <TableBody>
                {items.map((item) => {
                    return (
                        <CredentialRow
                            key={item.id}
                            {...item}
                            showUsername={showUsername}
                            showEmail={showEmail}
                            showPassword={showPassword}
                            showApiKey={showApiKey}
                            onDeletePress={onDeletePress(item.id)}
                        />
                    );
                })}

                <InputRow
                    source={source}
                    showUsername={showUsername}
                    showEmail={showEmail}
                    showPassword={showPassword}
                    showApiKey={showApiKey}
                    onAddPress={onAddPress}
                />
            </TableBody>
        </Table>
    );
}
