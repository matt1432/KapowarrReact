// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

// Specific Components
import ActionButton from './ActionButton';

// Types
import type { IndexFilter } from '..';

interface SearchVolumesButtonProps {
    filterKey: IndexFilter;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

export default function SearchVolumesButton(props: SearchVolumesButtonProps) {
    return (
        <ActionButton
            actionKey="search"
            icon={icons.SEARCH}
            labels={{
                all: 'SearchAll',
                filtered: 'SearchFiltered',
                selected: 'SearchSelected',
            }}
            {...props}
        />
    );
}
