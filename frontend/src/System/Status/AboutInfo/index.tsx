// IMPORTS

// React
import { useMemo } from 'react';

// Redux
import { useGetAboutInfoQuery } from 'Store/Api/Status';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import ClipboardButton from 'Components/Link/ClipboardButton';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';
import FieldSet from 'Components/FieldSet';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function AboutInfo() {
    const { data: aboutInfo } = useGetAboutInfoQuery();

    const aboutTable = useMemo(
        () => `
| Key               | Value
|-------------------|-------
| Kapowarr Version  | ${aboutInfo?.version}
| Python Version    | ${aboutInfo?.pythonVersion}
| Database Version  | ${aboutInfo?.databaseVersion}
| Database Location | ${aboutInfo?.databaseLocation}
| Data Folder       | ${aboutInfo?.dataFolder}

`,
        [aboutInfo],
    );

    return (
        <FieldSet
            legend={
                <div className={styles.legend}>
                    <label>{translate('About')}</label>
                    <ClipboardButton
                        className={styles.copyButton}
                        key="copy"
                        value={aboutTable}
                    />
                </div>
            }
        >
            <DescriptionList className={styles.descriptionList}>
                <DescriptionListItem
                    title={translate('KapowarrVersion')}
                    data={aboutInfo?.version}
                />

                <DescriptionListItem
                    title={translate('PythonVersion')}
                    data={aboutInfo?.pythonVersion}
                />

                <DescriptionListItem
                    title={translate('DatabaseVersion')}
                    data={aboutInfo?.databaseVersion}
                />

                <DescriptionListItem
                    title={translate('DatabaseLocation')}
                    data={aboutInfo?.databaseLocation}
                />

                <DescriptionListItem
                    title={translate('DataFolder')}
                    data={aboutInfo?.dataFolder}
                />
            </DescriptionList>
        </FieldSet>
    );
}
