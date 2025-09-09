// IMPORTS

// Specific Components
import Mega from './Mega';
import MediaFire from './MediaFire';
import WeTransfer from './WeTransfer';
import Pixeldrain from './Pixeldrain';
import GetComics from './GetComics';
import LibgenPlus from './LibgenPlus';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function BuiltInClients() {
    return (
        <div className={styles.builtinClients}>
            <Mega />
            <MediaFire />
            <WeTransfer />
            <Pixeldrain />
            <GetComics />
            <LibgenPlus />
        </div>
    );
}
