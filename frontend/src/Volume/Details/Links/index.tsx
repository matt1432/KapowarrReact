// IMPORTS

// Misc
import { kinds, sizes } from 'Helpers/Props';

// General Components
import Label from 'Components/Label';
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
import type { Volume } from 'Volume/Volume';

type LinksProps = Pick<Volume, 'siteUrl' | 'marvelId'>;

// IMPLEMENTATIONS

export default function Links({ marvelId, siteUrl }: LinksProps) {
    return (
        <div className={styles.links}>
            <Link className={styles.link} to={siteUrl}>
                <Label
                    className={styles.linkLabel}
                    kind={kinds.INFO}
                    size={sizes.LARGE}
                >
                    ComicVine
                </Label>
            </Link>

            {marvelId ? (
                <Link
                    className={styles.link}
                    to={`https://www.marvel.com/comics/series/${marvelId}`}
                >
                    <Label
                        className={styles.linkLabel}
                        kind={kinds.INFO}
                        size={sizes.LARGE}
                    >
                        Marvel.com
                    </Label>
                </Link>
            ) : null}
        </div>
    );
}
