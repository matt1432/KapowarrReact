// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';

// Specific Components
import ImageButton from './ImageButton';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function Links() {
    return (
        <>
            <FieldSet legend={translate('Donate')}>
                <div className={styles.linkContainer}>
                    <ImageButton
                        asset="getcomics.png"
                        link="https://getcomics.org/support/"
                        text={translate('DonateGetComics')}
                    />

                    <ImageButton
                        asset="ko-fi.webp"
                        link="https://ko-fi.com/casvt"
                        text={translate('DonateKapowarr')}
                    />
                </div>
            </FieldSet>

            <FieldSet legend={translate('Contact')}>
                <div className={styles.linkContainer}>
                    <ImageButton
                        asset="github.svg"
                        link="https://github.com/matt1432/Kapowarr/issues"
                        text={translate('ReportIssue')}
                    />

                    <ImageButton
                        asset="github.svg"
                        link="https://casvt.github.io/Kapowarr/"
                        text={translate('Documentation')}
                    />

                    <ImageButton
                        asset="discord.ico"
                        link="https://discord.gg/nMNdgG7vsE"
                        text={translate('Discord')}
                    />
                </div>
            </FieldSet>
        </>
    );
}
