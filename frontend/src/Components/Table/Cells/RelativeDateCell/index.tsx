// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Misc
import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';

// Specific Components
import TableRowCell from '../TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { MomentInput } from 'moment';

interface RelativeDateCellProps {
    className?: string;
    date?: MomentInput;
    includeSeconds?: boolean;
    includeTime?: boolean;
    component?: React.ElementType;
}

// IMPLEMENTATIONS

export default function RelativeDateCell({
    className = styles.cell,
    date,
    includeSeconds = false,
    includeTime = false,
    component: Component = TableRowCell,
    ...otherProps
}: RelativeDateCellProps) {
    const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } = useRootSelector(
        (state) => state.uiSettings,
    );

    if (!date) {
        return <Component className={className} {...otherProps} />;
    }

    return (
        <Component
            className={className}
            title={formatDateTime(date, longDateFormat, timeFormat, {
                includeSeconds,
                includeRelativeDay: !showRelativeDates,
            })}
            {...otherProps}
        >
            {getRelativeDate({
                date,
                shortDateFormat,
                showRelativeDates,
                timeFormat,
                includeSeconds,
                includeTime,
                timeForToday: true,
            })}
        </Component>
    );
}
