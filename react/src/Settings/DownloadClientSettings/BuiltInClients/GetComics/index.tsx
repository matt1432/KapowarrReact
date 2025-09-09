// TODO:
// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';

// Specific Components
import BuiltInClient from '../BuiltInClient';

// IMPLEMENTATIONS

export default function GetComics() {
    return (
        <BuiltInClient title="GetComics">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://getcomics.org" target="_blank">
                                GetComics
                            </a>{' '}
                            is a website that offers a vast amount of downloads for comics. Kapowarr
                            can search this website to find downloads for the volumes in your
                            library. The comics can be downloaded via multiple services. Kapowarr
                            has built-in support for almost all these services.
                            <br />
                            <br />
                            When downloading directly from the servers of GetComics (instead of
                            using an external service), the download speed will be significantly
                            reduced 400MB into the download. This behaviour is set up by the owner
                            of the website, is intentional, and is not planned to be removed.
                            <br />
                            <br />
                            Also, most often on Wednesday and Thursday, the site is very busy so the
                            downloads speed goes down a lot. Preferring external services in the
                            service preference list is advised in order to avoid this.
                        </p>
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={onModalClose}>{translate('Close')}</Button>
                    </ModalFooter>
                </>
            )}
        </BuiltInClient>
    );
}
