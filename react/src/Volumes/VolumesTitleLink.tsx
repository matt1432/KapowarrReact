import Link, { type LinkProps } from 'Components/Link/Link';

export interface VolumesTitleLinkProps extends LinkProps {
    titleSlug: string;
    title: string;
}

export default function VolumesTitleLink({
    titleSlug,
    title,
    ...linkProps
}: VolumesTitleLinkProps) {
    const link = `/volumes/${titleSlug}`;

    return (
        <Link to={link} {...linkProps}>
            {title}
        </Link>
    );
}
