import styles from './index.module.css';
import translate from 'Utilities/String/translate';
import { inputTypes, kinds } from 'Helpers/Props';
import FormInputGroup from 'Components/Form/FormInputGroup';
import { useCallback, useState } from 'react';
import type { InputChanged } from 'typings/inputs';
import SpinnerButton from 'Components/Link/SpinnerButton';
import { useApiKey } from 'Store/createApiEndpoints';

export default function LoginPage() {
    const { getApiKey, isLoading } = useApiKey();

    const [password, setPassword] = useState<string>('');

    const onInputChange = useCallback(
        ({ value }: InputChanged<string>) => {
            setPassword(value);
        },
        [setPassword],
    );

    const onPress = useCallback(() => {
        getApiKey({ password });
    }, [getApiKey, password]);

    return (
        <div className={styles.center}>
            <div className={styles.content}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <img
                            className={styles.logo}
                            src={`${window.Kapowarr.urlBase}/static/img/favicon.svg`}
                            alt="Kapowarr Logo"
                        />
                    </div>

                    <div className={styles.panelBody}>
                        <div className={styles.signIn}>SIGN IN TO CONTINUE</div>

                        <div className={styles.formGroup}>
                            <FormInputGroup
                                type={inputTypes.PASSWORD}
                                name="password"
                                placeholder="Password"
                                onChange={onInputChange}
                                value={password}
                            />

                            <SpinnerButton
                                kind={kinds.PRIMARY}
                                isSpinning={isLoading}
                                onPress={onPress}
                                className={styles.button}
                            >
                                {translate('Login')}
                            </SpinnerButton>

                            <div
                                id="login-failed"
                                className={[styles.loginFailed, styles.hidden].join(' ')}
                            >
                                Incorrect Password
                            </div>
                        </div>
                    </div>
                </div>

                <div id="copy" className={[styles.copy, styles.hidden].join(' ')}>
                    <span>&copy;</span>
                    <span id="year"></span>
                    <span>-</span>
                    <span>Kapowarr</span>
                </div>
            </div>
        </div>
    );
}
