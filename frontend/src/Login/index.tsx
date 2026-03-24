// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useApiKey } from 'Store/Api/Auth';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormInputGroup from 'Components/Form/FormInputGroup';
import SpinnerButton from 'Components/Link/SpinnerButton';
import Logo from 'Components/Page/Header/Logo';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

export default function LoginPage() {
    const { getApiKey, isLoading, isInvalid } = useApiKey();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onUsernameChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setUsername(value);
        },
        [setUsername],
    );

    const onPasswordChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setPassword(value);
        },
        [setPassword],
    );

    const onPress = useCallback(() => {
        getApiKey({ username, password });
    }, [getApiKey, username, password]);

    return (
        <div className={styles.center}>
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <Logo />
                </div>

                <div className={styles.panelBody}>
                    <div className={styles.signIn}>
                        {translate('SignInMessage')}
                    </div>

                    <div className={styles.formGroup}>
                        <Form>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="username"
                                placeholder={translate('Username')}
                                onChange={onUsernameChange}
                                value={username}
                                onSubmit={onPress}
                            />

                            <FormInputGroup
                                type={inputTypes.PASSWORD}
                                name="password"
                                placeholder={translate('Password')}
                                onChange={onPasswordChange}
                                value={password}
                                onSubmit={onPress}
                            />

                            <SpinnerButton
                                kind={kinds.PRIMARY}
                                isSpinning={isLoading}
                                onPress={onPress}
                                className={styles.button}
                            >
                                {translate('Login')}
                            </SpinnerButton>

                            {isInvalid && (
                                <div className={styles.loginFailed}>
                                    {translate('IncorrectCredentials')}
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
