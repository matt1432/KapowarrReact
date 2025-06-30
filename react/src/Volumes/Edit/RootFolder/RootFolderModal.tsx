import Modal from 'Components/Modal/Modal';
import RootFolderModalContent, { type RootFolderModalContentProps } from './RootFolderModalContent';

interface RootFolderModalProps extends RootFolderModalContentProps {
    isOpen: boolean;
}

function RootFolderModal(props: RootFolderModalProps) {
    const { isOpen, rootFolderPath, volumesId, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <RootFolderModalContent
                volumesId={volumesId}
                rootFolderPath={rootFolderPath}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default RootFolderModal;
