// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';

// Types
interface MediaInfoProps {
    dpi?: string;
    releaser?: string;
    resolution?: string;
    scanType?: string;
}

// IMPLEMENTATIONS

export default function MediaInfo({ dpi, releaser, resolution, scanType }: MediaInfoProps) {
    return (
        <DescriptionList>
            {dpi ? <DescriptionListItem key="dpi" title={translate('DPI')} data={dpi} /> : null}

            {releaser ? (
                <DescriptionListItem
                    key="releaser"
                    title={translate('ReleaseGroup')}
                    data={releaser}
                />
            ) : null}

            {resolution ? (
                <DescriptionListItem
                    key="resolution"
                    title={translate('Resolution')}
                    data={resolution}
                />
            ) : null}

            {scanType ? (
                <DescriptionListItem key="scanType" title={translate('ScanType')} data={scanType} />
            ) : null}
        </DescriptionList>
    );
}
