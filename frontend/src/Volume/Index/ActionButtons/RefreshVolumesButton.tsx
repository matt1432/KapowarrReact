// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

// Specific Components
import ActionButton from './ActionButton';

// Types
import type { IndexFilter } from '..';

interface RefreshVolumesButtonProps {
    filterKey: IndexFilter;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

export default function RefreshVolumesButton(props: RefreshVolumesButtonProps) {
    return (
        <ActionButton
            actionKey="update"
            icon={icons.REFRESH}
            labels={{
                all: 'UpdateAll',
                filtered: 'UpdateFiltered',
                selected: 'UpdateSelected',
            }}
            {...props}
        />
    );
}
