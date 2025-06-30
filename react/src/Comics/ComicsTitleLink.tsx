import Link, { type LinkProps } from 'Components/Link/Link';

export interface ComicsTitleLinkProps extends LinkProps {
    titleSlug: string;
    title: string;
}

export default function ComicsTitleLink({ titleSlug, title, ...linkProps }: ComicsTitleLinkProps) {
    const link = `/comics/${titleSlug}`;

    return (
        <Link to={link} {...linkProps}>
            {title}
        </Link>
    );
}
