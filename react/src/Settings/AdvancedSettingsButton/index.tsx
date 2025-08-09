// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { toggleAdvancedSettings } from 'Store/Slices/Settings';

// Misc
import classNames from 'classnames';

import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
interface AdvancedSettingsButtonProps {
    showLabel: boolean;
}

// IMPLEMENTATIONS

function AdvancedSettingsButton({ showLabel }: AdvancedSettingsButtonProps) {
    const showAdvancedSettings = useRootSelector((state) => state.settings.advancedSettings);
    const dispatch = useRootDispatch();

    const handlePress = useCallback(() => {
        dispatch(toggleAdvancedSettings());
    }, [dispatch]);

    return (
        <Link
            className={styles.button}
            title={
                showAdvancedSettings
                    ? translate('ShownClickToHide')
                    : translate('HiddenClickToShow')
            }
            onPress={handlePress}
        >
            <Icon name={icons.ADVANCED_SETTINGS} size={21} />

            <span className={classNames(styles.indicatorContainer, 'fa-layers fa-fw')}>
                <Icon className={styles.indicatorBackground} name={icons.CIRCLE} size={16} />

                <Icon
                    className={showAdvancedSettings ? styles.enabled : styles.disabled}
                    name={showAdvancedSettings ? icons.CHECK : icons.CLOSE}
                    size={10}
                />
            </span>

            {showLabel ? (
                <div className={styles.labelContainer}>
                    <div className={styles.label}>
                        {showAdvancedSettings
                            ? translate('HideAdvanced')
                            : translate('ShowAdvanced')}
                    </div>
                </div>
            ) : null}
        </Link>
    );
}

export default AdvancedSettingsButton;
