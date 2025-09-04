// IMPORTS

// Specific Components
import DescriptionListItemDescription, {
    type DescriptionListItemDescriptionProps,
} from './DescriptionListItemDescription';
import DescriptionListItemTitle, {
    type DescriptionListItemTitleProps,
} from './DescriptionListItemTitle';

// Types
interface DescriptionListItemProps {
    className?: string;
    titleClassName?: DescriptionListItemTitleProps['className'];
    descriptionClassName?: DescriptionListItemDescriptionProps['className'];
    title?: DescriptionListItemTitleProps['children'];
    data?: DescriptionListItemDescriptionProps['children'];
}

// IMPLEMENTATIONS

export default function DescriptionListItem({
    className,
    titleClassName,
    descriptionClassName,
    title,
    data,
}: DescriptionListItemProps) {
    return (
        <div className={className}>
            <DescriptionListItemTitle className={titleClassName}>{title}</DescriptionListItemTitle>

            <DescriptionListItemDescription className={descriptionClassName}>
                {data}
            </DescriptionListItemDescription>
        </div>
    );
}
