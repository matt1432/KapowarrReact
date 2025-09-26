import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IconKind, IconName } from 'Components/Icon';
import type { TranslateKey } from 'Utilities/String/translate';

interface IconProps {
    name: IconName;
    kind?: IconKind;
    title?: TranslateKey;
}

export interface Column<T extends string> {
    name: T;
    icon?: IconProps;
    className?: string;
    hideHeaderLabel?: boolean;
    isModifiable: boolean;
    isVisible: boolean;
    isSortable: boolean;
    fixedSortDirection?: SortDirection;
}
