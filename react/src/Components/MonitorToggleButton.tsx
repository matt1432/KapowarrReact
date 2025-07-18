// IMPORTS

// React
import { type SyntheticEvent, useCallback, useMemo } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';
import translate from 'Utilities/String/translate';

// General Components
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';

// CSS
import styles from './MonitorToggleButton.module.css';

// Types
interface MonitorToggleButtonProps {
    className?: string;
    monitored: boolean;
    size?: number;
    isDisabled?: boolean;
    isSaving?: boolean;
    onPress: (value: boolean, options: { shiftKey: boolean }) => unknown;
}

// IMPLEMENTATIONS

function MonitorToggleButton(props: MonitorToggleButtonProps) {
    const {
        className = styles.toggleButton,
        monitored,
        isDisabled = false,
        isSaving = false,
        size,
        onPress,
        ...otherProps
    } = props;

    const iconName = monitored ? icons.MONITORED : icons.UNMONITORED;

    const title = useMemo(() => {
        if (isDisabled) {
            return translate('ToggleMonitoredVolumeUnmonitored');
        }

        if (monitored) {
            return translate('ToggleMonitoredToUnmonitored');
        }

        return translate('ToggleUnmonitoredToMonitored');
    }, [monitored, isDisabled]);

    const handlePress = useCallback(
        (event: SyntheticEvent<HTMLLinkElement, MouseEvent>) => {
            const shiftKey = event.nativeEvent.shiftKey;

            onPress(!monitored, { shiftKey });
        },
        [monitored, onPress],
    );

    return (
        <SpinnerIconButton
            className={classNames(className, isDisabled && styles.isDisabled)}
            name={iconName}
            size={size}
            title={title}
            isDisabled={isDisabled}
            isSpinning={isSaving}
            {...otherProps}
            onPress={handlePress}
        />
    );
}

export default MonitorToggleButton;
