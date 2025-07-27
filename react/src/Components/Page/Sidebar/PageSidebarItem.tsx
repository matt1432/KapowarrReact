// IMPORTS

// React
import React, { Children, useCallback } from 'react';

// Misc
import classNames from 'classnames';

// General Components
import Icon, { type IconName } from 'Components/Icon';
import Link from 'Components/Link/Link';

// CSS
import styles from './PageSidebarItem.module.css';

// Types
export interface PageSidebarItemProps {
    iconName?: IconName;
    title: string | (() => string);
    to: string;
    isActive?: boolean;
    isActiveParent?: boolean;
    isParentItem?: boolean;
    isChildItem?: boolean;
    statusComponent?: React.ElementType;
    children?: React.ReactNode;
    onPress?: () => void;
}

// IMPLEMENTATIONS

function PageSidebarItem({
    iconName,
    title,
    to,
    isActive,
    isActiveParent,
    isChildItem = false,
    isParentItem = false,
    statusComponent: StatusComponent,
    children,
    onPress,
}: PageSidebarItemProps) {
    const handlePress = useCallback(() => {
        if (isChildItem || !isParentItem) {
            onPress?.();
        }
    }, [isChildItem, isParentItem, onPress]);

    return (
        <div className={classNames(styles.item, isActiveParent && styles.isActiveItem)}>
            <Link
                className={classNames(
                    isChildItem ? styles.childLink : styles.link,
                    isActiveParent && styles.isActiveParentLink,
                    isActive && styles.isActiveLink,
                )}
                to={to}
                onPress={handlePress}
            >
                {iconName && (
                    <span className={styles.iconContainer}>
                        <Icon name={iconName} />
                    </span>
                )}

                <span className={classNames(!iconName && styles.noIcon)}>
                    {typeof title === 'function' ? title() : title}
                </span>

                {!!StatusComponent && (
                    <span className={styles.status}>
                        <StatusComponent />
                    </span>
                )}
            </Link>

            {children
                ? Children.map(children, (child) => {
                      if (!React.isValidElement(child)) {
                          return child;
                      }

                      const childProps = { isChildItem: true };

                      return React.cloneElement(child, childProps);
                  })
                : null}
        </div>
    );
}

export default PageSidebarItem;
