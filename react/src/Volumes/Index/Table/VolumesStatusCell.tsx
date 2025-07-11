import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import { icons } from 'Helpers/Props';
// import { type VolumesStatus } from 'Volumes/Volumes';
import { getVolumesStatusDetails } from 'Volumes/VolumesStatus';
// import { toggleVolumesMonitored } from 'Store/Actions/volumesActions';
import translate from 'Utilities/String/translate';
import styles from './VolumesStatusCell.module.css';

interface VolumesStatusCellProps {
    className: string;
    volumesId: number;
    monitored: boolean;
    status: string; // VolumesStatus;
    isSelectMode: boolean;
    isSaving: boolean;
    component?: React.ElementType;
}

function VolumesStatusCell(props: VolumesStatusCellProps) {
    const {
        className,
        volumesId,
        monitored,
        status,
        isSelectMode,
        isSaving,
        component: Component = VirtualTableRowCell,
        ...otherProps
    } = props;

    const statusDetails = getVolumesStatusDetails(status);
    const dispatch = useDispatch();

    const onMonitoredPress = useCallback(() => {
        // dispatch(toggleVolumesMonitored({ volumesId, monitored: !monitored }));
    }, [volumesId, monitored, dispatch]);

    return (
        <Component className={className} {...otherProps}>
            {isSelectMode ? (
                <MonitorToggleButton
                    className={styles.statusIcon}
                    monitored={monitored}
                    isSaving={isSaving}
                    onPress={onMonitoredPress}
                />
            ) : (
                <Icon
                    className={styles.statusIcon}
                    name={monitored ? icons.MONITORED : icons.UNMONITORED}
                    title={
                        monitored
                            ? translate('VolumesIsMonitored')
                            : translate('VolumesIsUnmonitored')
                    }
                />
            )}

            <Icon
                className={styles.statusIcon}
                name={statusDetails.icon}
                title={`${statusDetails.title}: ${statusDetails.message}`}
            />
        </Component>
    );
}

export default VolumesStatusCell;
