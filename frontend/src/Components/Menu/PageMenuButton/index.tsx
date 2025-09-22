// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Icon from 'Components/Icon';
import MenuButton from 'Components/Menu/MenuButton';

// CSS
import styles from './index.module.css';

// Types
import type { IconName } from '@fortawesome/free-regular-svg-icons';

interface PageMenuButtonProps {
    iconName: IconName;
    showIndicator: boolean;
    text?: string;
}

// IMPLEMENTATIONS

export default function PageMenuButton({
    iconName,
    showIndicator = false,
    text,
    ...otherProps
}: PageMenuButtonProps) {
    return (
        <MenuButton className={styles.menuButton} {...otherProps}>
            <Icon name={iconName} size={18} />

            {showIndicator ? (
                <span className={classNames(styles.indicatorContainer, 'fa-layers fa-fw')}>
                    <Icon name={icons.CIRCLE} size={9} />
                </span>
            ) : null}

            <div className={styles.label}>{text}</div>
        </MenuButton>
    );
}
