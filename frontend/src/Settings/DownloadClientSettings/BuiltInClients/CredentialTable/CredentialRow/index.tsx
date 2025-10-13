// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import { icons } from 'Helpers/Props';

// Types
import type { CredentialData } from 'typings/DownloadClient';
import type { Column } from 'Components/Table/Column';
import type { CredentialColumnName } from '../columns';

type CredentialRowProps = CredentialData & {
    columns: Column<CredentialColumnName>[];
    onDeletePress: () => void;
};

// IMPLEMENTATIONS

export default function CredentialRow({
    columns,
    username,
    email,
    password,
    apiKey,
    onDeletePress,
}: CredentialRowProps) {
    return (
        <TableRow>
            {columns.map(({ name, isVisible }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'username') {
                    return <TableRowCell key={name}>{username}</TableRowCell>;
                }

                if (name === 'email') {
                    return <TableRowCell key={name}>{email}</TableRowCell>;
                }

                if (name === 'password') {
                    return (
                        <TableRowCell key={name}>
                            {Array.from(password ?? '')
                                .map(() => '*')
                                .join('')}
                        </TableRowCell>
                    );
                }

                if (name === 'apiKey') {
                    return (
                        <TableRowCell key={name}>
                            {Array.from(apiKey?.slice(0, -5) ?? '')
                                .map(() => '*')
                                .join('')}
                            {apiKey?.slice(-5)}
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name}>
                            <IconButton
                                title={translate('Delete')}
                                name={icons.REMOVE}
                                onPress={onDeletePress}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
