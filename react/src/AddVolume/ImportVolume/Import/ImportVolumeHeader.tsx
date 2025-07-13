import VolumeMonitoringOptionsPopoverContent from 'AddVolume/VolumeMonitoringOptionsPopoverContent';
import VolumeTypePopoverContent from 'AddVolume/VolumeTypePopoverContent';
import Icon from 'Components/Icon';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, tooltipPositions } from 'Helpers/Props';
import { type CheckInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import styles from './ImportVolumeHeader.module.css';

interface ImportVolumeHeaderProps {
    allSelected: boolean;
    allUnselected: boolean;
    onSelectAllChange: (change: CheckInputChanged) => void;
}

function ImportVolumeHeader({
    allSelected,
    allUnselected,
    onSelectAllChange,
}: ImportVolumeHeaderProps) {
    return (
        <VirtualTableHeader>
            <VirtualTableSelectAllHeaderCell
                allSelected={allSelected}
                allUnselected={allUnselected}
                onSelectAllChange={onSelectAllChange}
            />

            <VirtualTableHeaderCell className={styles.folder} name="folder">
                {translate('Folder')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.monitor} name="monitor">
                {translate('Monitor')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('MonitoringOptions')}
                    body={<VolumeMonitoringOptionsPopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.qualityProfile} name="qualityProfileId">
                {translate('QualityProfile')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.volumeType} name="volumeType">
                {translate('VolumeType')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('VolumeType')}
                    body={<VolumeTypePopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.seasonFolder} name="seasonFolder">
                {translate('SeasonFolder')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.volume} name="volume">
                {translate('Volume')}
            </VirtualTableHeaderCell>
        </VirtualTableHeader>
    );
}

export default ImportVolumeHeader;
