// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
interface FormInputHelpTextProps {
    className?: string;
    text: string;
    link?: string;
    tooltip?: string;
    isError?: boolean;
    isWarning?: boolean;
    isCheckInput?: boolean;
}

// IMPLEMENTATIONS

export default function FormInputHelpText({
    className = styles.helpText,
    text,
    link,
    tooltip,
    isError = false,
    isWarning = false,
    isCheckInput = false,
}: FormInputHelpTextProps) {
    return (
        <div
            className={classNames(
                className,
                isError && styles.isError,
                isWarning && styles.isWarning,
                isCheckInput && styles.isCheckInput,
            )}
        >
            {text}

            {link ? (
                <Link className={styles.link} to={link} title={tooltip}>
                    <Icon name={icons.EXTERNAL_LINK} />
                </Link>
            ) : null}

            {!link && tooltip ? (
                <Icon
                    containerClassName={styles.details}
                    name={icons.INFO}
                    title={tooltip}
                />
            ) : null}
        </div>
    );
}
