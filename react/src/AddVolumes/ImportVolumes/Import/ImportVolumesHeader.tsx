import VolumesMonitoringOptionsPopoverContent from 'AddVolumes/VolumesMonitoringOptionsPopoverContent';
import VolumesTypePopoverContent from 'AddVolumes/VolumesTypePopoverContent';
import Icon from 'Components/Icon';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, tooltipPositions } from 'Helpers/Props';
import { type CheckInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import styles from './ImportVolumesHeader.module.css';

interface ImportVolumesHeaderProps {
    allSelected: boolean;
    allUnselected: boolean;
    onSelectAllChange: (change: CheckInputChanged) => void;
}

function ImportVolumesHeader({
    allSelected,
    allUnselected,
    onSelectAllChange,
}: ImportVolumesHeaderProps) {
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
                    body={<VolumesMonitoringOptionsPopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.qualityProfile} name="qualityProfileId">
                {translate('QualityProfile')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.volumesType} name="volumesType">
                {translate('VolumesType')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('VolumesType')}
                    body={<VolumesTypePopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.seasonFolder} name="seasonFolder">
                {translate('SeasonFolder')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.volumes} name="volumes">
                {translate('Volumes')}
            </VirtualTableHeaderCell>
        </VirtualTableHeader>
    );
}

export default ImportVolumesHeader;
