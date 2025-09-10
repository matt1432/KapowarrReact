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

type CredentialRowProps = CredentialData & {
    showUsername: boolean;
    showEmail: boolean;
    showPassword: boolean;
    showApiKey: boolean;
    onDeletePress: () => void;
};

// IMPLEMENTATIONS

export default function CredentialRow({
    username,
    showUsername,
    email,
    showEmail,
    password,
    showPassword,
    apiKey,
    showApiKey,
    onDeletePress,
}: CredentialRowProps) {
    return (
        <TableRow>
            {showUsername ? <TableRowCell>{username}</TableRowCell> : null}

            {showEmail ? <TableRowCell>{email}</TableRowCell> : null}

            {showPassword ? (
                <TableRowCell>
                    {Array.from(password ?? '')
                        .map(() => '*')
                        .join('')}
                </TableRowCell>
            ) : null}

            {showApiKey ? (
                <TableRowCell>
                    {Array.from(apiKey?.slice(0, -5) ?? '')
                        .map(() => '*')
                        .join('')}
                    {apiKey?.slice(-5)}
                </TableRowCell>
            ) : null}

            <TableRowCell>
                <IconButton
                    title={translate('Delete')}
                    name={icons.REMOVE}
                    onPress={onDeletePress}
                />
            </TableRowCell>
        </TableRow>
    );
}
