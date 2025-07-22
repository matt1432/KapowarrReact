// IMPORTS

// Misc
import { kinds, sizes } from 'Helpers/Props';

// General Components
import Label from 'Components/Label';
import Link from 'Components/Link/Link';

// CSS
import styles from './VolumeDetailsLinks.module.css';

// Types
import type { Volume } from 'Volume/Volume';

type VolumeDetailsLinksProps = Pick<Volume, 'siteUrl'>;

// IMPLEMENTATIONS

function VolumeDetailsLinks({ siteUrl }: VolumeDetailsLinksProps) {
    return (
        <div className={styles.links}>
            <Link className={styles.link} to={siteUrl}>
                <Label className={styles.linkLabel} kind={kinds.INFO} size={sizes.LARGE}>
                    ComicVine
                </Label>
            </Link>
        </div>
    );
}

export default VolumeDetailsLinks;
