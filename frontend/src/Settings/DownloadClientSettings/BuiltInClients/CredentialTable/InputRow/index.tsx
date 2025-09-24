// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import TextInput from 'Components/Form/TextInput';

// Types
import type { AddCredentialParams } from 'Store/Api/DownloadClients';
import type { CredentialSource } from 'typings/DownloadClient';
import type { InputChanged } from 'typings/Inputs';

interface InputRowProps {
    source: CredentialSource;
    showUsername: boolean;
    showEmail: boolean;
    showPassword: boolean;
    showApiKey: boolean;
    onAddPress: (data: AddCredentialParams) => void;
}

// IMPLEMENTATIONS

export default function InputRow({
    source,
    showUsername,
    showEmail,
    showPassword,
    showApiKey,
    onAddPress,
}: InputRowProps) {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');

    const handleUsernameChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setUsername(value);
        },
        [],
    );
    const handleEmailChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setEmail(value);
        },
        [],
    );
    const handlePasswordChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setPassword(value);
        },
        [],
    );
    const handleApiKeyChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setApiKey(value);
        },
        [],
    );

    const handleAddPress = useCallback(() => {
        onAddPress({
            source,
            username: showUsername ? username : null,
            email: showEmail ? email : null,
            password: showPassword ? password : null,
            apiKey: showApiKey ? apiKey : null,
        });
    }, [
        onAddPress,
        showUsername,
        username,
        showEmail,
        email,
        showPassword,
        password,
        showApiKey,
        apiKey,
        source,
    ]);

    return (
        <TableRow>
            {showUsername ? (
                <TableRowCell>
                    <TextInput
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </TableRowCell>
            ) : null}

            {showEmail ? (
                <TableRowCell>
                    <TextInput
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </TableRowCell>
            ) : null}

            {showPassword ? (
                <TableRowCell>
                    <TextInput
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </TableRowCell>
            ) : null}

            {showApiKey ? (
                <TableRowCell>
                    <TextInput
                        name="apiKey"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                    />
                </TableRowCell>
            ) : null}

            <TableRowCell>
                <IconButton
                    title={translate('Add')}
                    name={icons.ADD}
                    onPress={handleAddPress}
                />
            </TableRowCell>
        </TableRow>
    );
}
