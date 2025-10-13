// IMPORTS

// React
import { useCallback, useEffect, useMemo } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';

import { setTableOptions } from 'Store/Slices/TableOptions';
import {
    useAddCredentialMutation,
    useDeleteCredentialMutation,
    useGetCredentialsQuery,
    type AddCredentialParams,
} from 'Store/Api/DownloadClients';

// General Components
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import CredentialRow from './CredentialRow';
import InputRow from './InputRow';

// Types
import type { CredentialSource } from 'typings/DownloadClient';

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
    const dispatch = useRootDispatch();

    const { columns } = useRootSelector(
        (state) => state.tableOptions.credentialTable,
    );

    useEffect(() => {
        dispatch(
            setTableOptions({
                tableName: 'credentialTable',
                columns: columns.map((column) => {
                    if (column.name === 'email') {
                        return {
                            ...column,
                            isVisible: showEmail,
                        };
                    }
                    if (column.name === 'username') {
                        return {
                            ...column,
                            isVisible: showUsername,
                        };
                    }
                    if (column.name === 'password') {
                        return {
                            ...column,
                            isVisible: showPassword,
                        };
                    }
                    if (column.name === 'apiKey') {
                        return {
                            ...column,
                            isVisible: showApiKey,
                        };
                    }
                    return column;
                }),
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEmail, showUsername, showPassword, showApiKey]);

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
        <Table tableName="credentialTable" columns={columns}>
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
