// TODO:
import { useCallback } from 'react';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
// import { selectDownloadClientSchema } from 'Store/Actions/settingsActions';
import type { DownloadClient } from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import AddDownloadClientPresetMenuItem from '../AddDownloadClientPresetMenuItem';
import styles from './index.module.css';

interface AddDownloadClientItemProps {
    implementation: string;
    implementationName: string;
    infoLink: string;
    presets?: DownloadClient[];
    onDownloadClientSelect: () => void;
}

export default function AddDownloadClientItem({
    implementation,
    implementationName,
    infoLink,
    presets,
    onDownloadClientSelect,
}: AddDownloadClientItemProps) {
    const hasPresets = !!presets && !!presets.length;

    const handleDownloadClientSelect = useCallback(() => {
        /*
        selectDownloadClientSchema({
            implementation,
            implementationName,
        });*/

        onDownloadClientSelect();
    }, [implementation, implementationName, onDownloadClientSelect]);

    return (
        <div className={styles.downloadClient}>
            <Link className={styles.underlay} onPress={handleDownloadClientSelect} />

            <div className={styles.overlay}>
                <div className={styles.name}>{implementationName}</div>

                <div className={styles.actions}>
                    {hasPresets ? (
                        <span>
                            <Button size={sizes.SMALL} onPress={handleDownloadClientSelect}>
                                {translate('Custom')}
                            </Button>

                            <Menu className={styles.presetsMenu}>
                                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                                    {translate('Presets')}
                                </Button>

                                <MenuContent>
                                    {presets.map((preset) => {
                                        return (
                                            <AddDownloadClientPresetMenuItem
                                                key={preset.title}
                                                name={preset.title}
                                                implementation={implementation}
                                                implementationName={implementationName}
                                                onPress={onDownloadClientSelect}
                                            />
                                        );
                                    })}
                                </MenuContent>
                            </Menu>
                        </span>
                    ) : null}

                    <Button to={infoLink} size={sizes.SMALL}>
                        {translate('MoreInfo')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
