// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import InteractiveImportModalContent from './Interactive/InteractiveImportModalContent';

// Types
import type { InteractiveImportModalContentProps } from './Interactive/InteractiveImportModalContent';

interface InteractiveImportModalProps extends Omit<
    InteractiveImportModalContentProps,
    'modalTitle'
> {
    isOpen: boolean;
    modalTitle?: string;
    onModalClose(): void;
}

export default function InteractiveImportModal({
    isOpen,
    modalTitle = translate('ManualImport'),
    onModalClose,
    ...otherProps
}: InteractiveImportModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            size={sizes.EXTRA_EXTRA_LARGE}
            closeOnBackgroundClick={false}
            onModalClose={onModalClose}
        >
            <InteractiveImportModalContent
                {...otherProps}
                modalTitle={modalTitle}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
