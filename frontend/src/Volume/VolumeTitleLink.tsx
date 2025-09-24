// IMPORTS

// General Components
import Link, { type LinkProps } from 'Components/Link/Link';

// Types
export interface VolumeTitleLinkProps extends LinkProps {
    titleSlug: string;
    title: string;
}

// IMPLEMENTATIONS

export default function VolumeTitleLink({
    titleSlug,
    title,
    ...linkProps
}: VolumeTitleLinkProps) {
    const link = `/volumes/${titleSlug}`;

    return (
        <Link to={link} {...linkProps}>
            {title}
        </Link>
    );
}
