// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// Specific Components
import ParseModal from 'Parse/ParseModal';

// IMPLEMENTATIONS

function ParseToolbarButton() {
    const [isParseModalOpen, setIsParseModalOpen] = useState(false);

    const onOpenParseModalPress = useCallback(() => {
        setIsParseModalOpen(true);
    }, [setIsParseModalOpen]);

    const onParseModalClose = useCallback(() => {
        setIsParseModalOpen(false);
    }, [setIsParseModalOpen]);

    return (
        <>
            <PageToolbarButton
                label={translate('TestParsing')}
                iconName={icons.PARSE}
                onPress={onOpenParseModalPress}
            />

            <ParseModal isOpen={isParseModalOpen} onModalClose={onParseModalClose} />
        </>
    );
}

export default ParseToolbarButton;
