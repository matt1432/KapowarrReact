// IMPORTS

// General Components
import Label from 'Components/Label';

// Types
import type { Kind } from 'Helpers/Props/kinds';

interface PageSidebarStatusProps {
    count?: number;
    hasErrors?: boolean;
    hasWarnings?: boolean;
}

// IMPLEMENTATIONS

export default function PageSidebarStatus({
    count,
    hasErrors,
    hasWarnings,
}: PageSidebarStatusProps) {
    if (!count) {
        return null;
    }

    let kind: Kind = 'info';

    if (hasErrors) {
        kind = 'danger';
    }
    else if (hasWarnings) {
        kind = 'warning';
    }

    return (
        <Label kind={kind} size="medium">
            {count}
        </Label>
    );
}
