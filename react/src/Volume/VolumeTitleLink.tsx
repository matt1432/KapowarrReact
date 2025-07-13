import Link, { type LinkProps } from 'Components/Link/Link';

export interface VolumeTitleLinkProps extends LinkProps {
    titleSlug: string;
    title: string;
}

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
