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
    const { getApiKey, isLoading, isInvalidPassword } = useApiKey();

    const [password, setPassword] = useState<string>('');

    const onInputChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setPassword(value);
        },
        [setPassword],
    );

    const onPress = useCallback(() => {
        getApiKey({ password });
    }, [getApiKey, password]);

    return (
        <div className={styles.center}>
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <Logo />
                </div>

                <div className={styles.panelBody}>
                    <div className={styles.signIn}>{translate('SignInMessage')}</div>

                    <div className={styles.formGroup}>
                        <Form>
                            <FormInputGroup
                                type={inputTypes.PASSWORD}
                                name="password"
                                placeholder={translate('Password')}
                                onChange={onInputChange}
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

                            {isInvalidPassword && (
                                <div className={styles.loginFailed}>
                                    {translate('IncorrectPassword')}
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
