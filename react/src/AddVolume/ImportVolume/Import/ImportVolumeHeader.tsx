// TODO:
// IMPORTS

// Misc
import { icons, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Popover from 'Components/Tooltip/Popover';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';

// Specific Components
import VolumeMonitoringOptionsPopoverContent from 'AddVolume/VolumeMonitoringOptionsPopoverContent';
import SpecialVersionPopoverContent from 'AddVolume/SpecialVersionPopoverContent';

// CSS
import styles from './ImportVolumeHeader.module.css';

// Types
import type { CheckInputChanged } from 'typings/inputs';

interface ImportVolumeHeaderProps {
    allSelected: boolean;
    allUnselected: boolean;
    onSelectAllChange: (change: CheckInputChanged) => void;
}

// IMPLEMENTATIONS

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

            <VirtualTableHeaderCell className={styles.specialVersion} name="specialVersion">
                {translate('SpecialVersion')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('SpecialVersion')}
                    body={<SpecialVersionPopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.volume} name="volume">
                {translate('Volumes')}
            </VirtualTableHeaderCell>
        </VirtualTableHeader>
    );
}

export default ImportVolumeHeader;
