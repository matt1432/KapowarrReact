// IMPORTS

// React

// Redux

// Misc
// import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useEditSettings from 'Settings/useEditSettings';

// General Components
// import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
// import FormGroup from 'Components/Form/FormGroup';
// import FormInputButton from 'Components/Form/FormInputButton';
// import FormInputGroup from 'Components/Form/FormInputGroup';
// import FormInputHelpText from 'Components/Form/FormInputHelpText';
// import FormLabel from 'Components/Form/FormLabel';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Specific Components

// CSS

// Types

// IMPLEMENTATIONS

export default function GeneralSettings() {
    const {
        isSaving,
        hasPendingChanges,
        onSavePress,
        // handleInputChange,
        // handleNonNullInputChange,
        // changes,
    } = useEditSettings();

    return (
        <PageContent title={translate('GeneralSettings')}>
            <SettingsToolbar
                isSaving={isSaving}
                hasPendingChanges={hasPendingChanges}
                onSavePress={onSavePress}
            />

            <PageContentBody>
                <Form id="generalSettings">TODO:</Form>
            </PageContentBody>
        </PageContent>
    );
}
