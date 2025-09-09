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

export default function LibgenPlus() {
    return (
        <BuiltInClient title="Libgen+">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://libgen.gs/json.php" target="_blank">
                                Libgen+
                            </a>{' '}
                            is a website that offers a vast amount of downloads for comics. Kapowarr
                            can search this website to find downloads for the volumes in your
                            library.
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
