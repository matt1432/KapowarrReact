// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Types
interface AppUpdatedModalContentProps {
    onModalClose: () => void;
}

// IMPLEMENTATIONS

// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/App/AppUpdatedModalContent.tsx
function AppUpdatedModalContent(props: AppUpdatedModalContentProps) {
    const { onModalClose } = props;

    const handleSeeChangesPress = useCallback(() => {
        window.location.href = `${window.Kapowarr.urlBase}/system/updates`;
    }, []);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('AppUpdated')}</ModalHeader>

            <ModalBody>
                <div>
                    <InlineMarkdown data={translate('AppUpdatedVersion')} />
                </div>
            </ModalBody>

            <ModalFooter>
                <Button onPress={handleSeeChangesPress}>{translate('RecentChanges')}</Button>

                <Button kind={kinds.PRIMARY} onPress={onModalClose}>
                    {translate('Reload')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default AppUpdatedModalContent;
