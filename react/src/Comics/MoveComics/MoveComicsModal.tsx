import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds, sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './MoveComicsModal.module.css';

interface MoveComicsModalProps {
    originalPath?: string;
    destinationPath?: string;
    destinationRootFolder?: string;
    isOpen: boolean;
    onModalClose: () => void;
    onSavePress: () => void;
    onMoveComicsPress: () => void;
}

function MoveComicsModal({
    originalPath,
    destinationPath,
    destinationRootFolder,
    isOpen,
    onModalClose,
    onSavePress,
    onMoveComicsPress,
}: MoveComicsModalProps) {
    if (isOpen && !originalPath && !destinationPath && !destinationRootFolder) {
        console.error('originalPath and destinationPath OR destinationRootFolder must be provided');
    }

    return (
        <Modal
            isOpen={isOpen}
            size={sizes.MEDIUM}
            closeOnBackgroundClick={false}
            onModalClose={onModalClose}
        >
            <ModalContent showCloseButton={true} onModalClose={onModalClose}>
                <ModalHeader>{translate('MoveFiles')}</ModalHeader>

                <ModalBody>
                    {destinationRootFolder
                        ? translate('MoveComicsFoldersToRootFolder', {
                              destinationRootFolder,
                          })
                        : null}

                    {originalPath && destinationPath
                        ? translate('MoveComicsFoldersToNewPath', {
                              originalPath,
                              destinationPath,
                          })
                        : null}
                </ModalBody>

                <ModalFooter>
                    <Button className={styles.doNotMoveButton} onPress={onSavePress}>
                        {translate('MoveComicsFoldersDontMoveFiles')}
                    </Button>

                    <Button kind={kinds.DANGER} onPress={onMoveComicsPress}>
                        {translate('MoveComicsFoldersMoveFiles')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default MoveComicsModal;
