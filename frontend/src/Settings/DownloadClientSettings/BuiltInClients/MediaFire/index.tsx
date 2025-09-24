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

export default function MediaFire() {
    return (
        <BuiltInClient title="MediaFire">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a
                                href="https://www.mediafire.com/"
                                target="_blank"
                            >
                                MediaFire
                            </a>{' '}
                            is a file sharing service from which Kapowarr can
                            download files.
                            <br />
                            <br />
                            MediaFire does not limit how much you can download
                            per day.
                        </p>
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
