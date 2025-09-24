// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import FieldSet from 'Components/FieldSet';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';

// Specific Components
import BuiltInClient from '../BuiltInClient';
import CredentialTable from '../CredentialTable';

// IMPLEMENTATIONS

export default function Mega() {
    return (
        <BuiltInClient title="Mega">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://mega.io/" target="_blank">
                                Mega
                            </a>{' '}
                            is a file sharing service that supports end-to-end
                            encrypted downloads, which Kapowarr makes use of.
                            <br />
                            <br />
                            By default, you are limited to downloading around
                            5GB of files per day from Mega. There are no
                            download speed constraints.
                            <br />
                            <br />
                            Mega offers free and paid accounts that come with
                            higher limits for downloading files. Kapowarr is
                            able to download files using an account to take
                            advantage of these higher limits (i.e. being able to
                            download more than 5GB per day). If you have a Mega
                            account, it's advised to enter the credentials below
                            so that Kapowarr can take advantage of it's premium
                            features. Also make sure to set Mega high in the
                            service preference list, so that Kapowarr will
                            prefer using it.
                        </p>

                        <FieldSet legend={translate('Settings')}>
                            <CredentialTable
                                source="mega"
                                showEmail
                                showPassword
                            />
                        </FieldSet>
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={onModalClose}>
                            {translate('Close')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </BuiltInClient>
    );
}
