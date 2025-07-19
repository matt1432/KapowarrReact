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

type VolumeDetailsLinksProps = Pick<Volume, 'site_url'>;

// IMPLEMENTATIONS

function VolumeDetailsLinks(props: VolumeDetailsLinksProps) {
    const { site_url } = props;

    return (
        <div className={styles.links}>
            <Link className={styles.link} to={site_url}>
                <Label className={styles.linkLabel} kind={kinds.INFO} size={sizes.LARGE}>
                    ComicVine
                </Label>
            </Link>
        </div>
    );
}

export default VolumeDetailsLinks;
