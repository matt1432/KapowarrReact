// IMPORTS

// Misc
import { kinds } from 'Helpers/Props';

// General Components
import Button from 'Components/Link/Button';

// CSS
import styles from './index.module.css';

// Types
interface ImageButtonProps {
    link: string;
    text: string;
    asset: string;
}

// IMPLEMENTATIONS

export default function ImageButton({ link, text, asset }: ImageButtonProps) {
    return (
        <Button className={styles.button} kind={kinds.PRIMARY} to={link}>
            <img
                src={`${window.Kapowarr.urlBase}/static/img/${asset}`}
                alt=""
                width={32}
                height={32}
            />
            <label className={styles.label}>{text}</label>
        </Button>
    );
}
