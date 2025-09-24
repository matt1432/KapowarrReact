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

export default function WeTransfer() {
    return (
        <BuiltInClient title="WeTransfer">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://wetransfer.com/" target="_blank">
                                WeTransfer
                            </a>{' '}
                            is a file sharing service from which Kapowarr can
                            download files.
                            <br />
                            <br />
                            WeTransfer does not limit how much you can download
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
