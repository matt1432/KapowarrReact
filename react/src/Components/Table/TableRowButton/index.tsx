// IMPORTS

// General Components
import Link, { type LinkProps } from 'Components/Link/Link';

// Specific Components
import TableRow from '../TableRow';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

function TableRowButton(props: LinkProps) {
    return <Link className={styles.row} component={TableRow} {...props} />;
}

export default TableRowButton;
