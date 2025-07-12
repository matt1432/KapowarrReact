import React, { useCallback } from 'react';
import Icon, { type IconName } from 'Components/Icon';
import { icons } from 'Helpers/Props';
import MenuItem, { type MenuItemProps } from './MenuItem';
import styles from './SelectedMenuItem.module.css';

export interface SelectedMenuItemProps<T> extends Omit<MenuItemProps, 'onPress' | 'name'> {
    name?: T;
    children: React.ReactNode;
    selectedIconName?: IconName;
    isSelected: boolean;
    onPress: (name: T) => void;
}

function SelectedMenuItem<T>({
    children,
    name,
    selectedIconName = icons.CHECK,
    isSelected,
    onPress,
    ...otherProps
}: SelectedMenuItemProps<T>) {
    const handlePress = useCallback(() => {
        onPress(name ?? ('' as T));
    }, [name, onPress]);

    return (
        <MenuItem {...otherProps} onPress={handlePress}>
            <div className={styles.item}>
                {children}

                <Icon
                    className={isSelected ? styles.isSelected : styles.isNotSelected}
                    name={selectedIconName}
                />
            </div>
        </MenuItem>
    );
}

export default SelectedMenuItem;
