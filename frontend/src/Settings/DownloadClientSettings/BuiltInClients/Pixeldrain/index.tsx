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

export default function Pixeldrain() {
    return (
        <BuiltInClient title="Pixeldrain">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://pixeldrain.com/" target="_blank">
                                Pixeldrain
                            </a>{' '}
                            is a file sharing service from which Kapowarr can
                            download files.
                            <br />
                            <br />
                            By default, you can download up to 6GB of files at
                            full speed per day from Pixeldrain. After that limit
                            is reached, download speed is reduced to 1MB/s.
                            <br />
                            <br />
                            Pixeldrain offers paid subscription plans that
                            remove this speed limit. Kapowarr is able to
                            download files using an account to take advantage of
                            these higher limits (i.e. download more than 6GB per
                            day at full speed). If you have a Pixeldrain
                            account, it's advised to enter the credentials below
                            so that Kapowarr can take advantage of it's premium
                            features. Also make sure to set Pixeldrain high in
                            the service preference list, so that Kapowarr will
                            prefer using it.
                        </p>

                        <FieldSet legend={translate('Settings')}>
                            <CredentialTable source="pixeldrain" showApiKey />
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
