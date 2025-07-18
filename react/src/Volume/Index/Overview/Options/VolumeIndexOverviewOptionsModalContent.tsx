// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import selectOverviewOptions from '../selectOverviewOptions';
// import { setVolumeOverviewOption } from 'Store/Actions/volumeIndexActions';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Types
interface VolumeIndexOverviewOptionsModalContentProps {
    onModalClose(...args: unknown[]): void;
}

// IMPLEMENTATIONS

const posterSizeOptions: EnhancedSelectInputValue<string>[] = [
    {
        key: 'small',
        get value() {
            return translate('Small');
        },
    },
    {
        key: 'medium',
        get value() {
            return translate('Medium');
        },
    },
    {
        key: 'large',
        get value() {
            return translate('Large');
        },
    },
];

function VolumeIndexOverviewOptionsModalContent(
    props: VolumeIndexOverviewOptionsModalContentProps,
) {
    const { onModalClose } = props;

    const {
        detailedProgressBar,
        size,
        showMonitored,
        showPublisher,
        showQualityProfile,
        showPreviousAiring,
        showAdded,
        showSeasonCount,
        showPath,
        showSizeOnDisk,
        showTags,
        showSearchAction,
    } = {
        detailedProgressBar: false,
        size: 'large',
        showMonitored: false,
        showPublisher: false,
        showQualityProfile: false,
        showPreviousAiring: false,
        showAdded: false,
        showSeasonCount: false,
        showPath: false,
        showSizeOnDisk: false,
        showTags: false,
        showSearchAction: false,
    }; // useSelector(selectOverviewOptions);

    const dispatch = useDispatch();

    const onOverviewOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        ({ name, value }: { name: string; value: unknown }) => {
            // dispatch(setVolumeOverviewOption({ [name]: value }));
        },
        [dispatch],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OverviewOptions')}</ModalHeader>

            <ModalBody>
                <Form>
                    <FormGroup>
                        <FormLabel>{translate('PosterSize')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.SELECT}
                            name="size"
                            value={size}
                            values={posterSizeOptions}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('DetailedProgressBar')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="detailedProgressBar"
                            value={detailedProgressBar}
                            helpText={translate('DetailedProgressBarHelpText')}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowMonitored')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showMonitored"
                            value={showMonitored}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowPublisher')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showPublisher"
                            value={showPublisher}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowQualityProfile')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showQualityProfile"
                            value={showQualityProfile}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowPreviousAiring')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showPreviousAiring"
                            value={showPreviousAiring}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowDateAdded')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showAdded"
                            value={showAdded}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowSeasonCount')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showSeasonCount"
                            value={showSeasonCount}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowPath')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showPath"
                            value={showPath}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowSizeOnDisk')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showSizeOnDisk"
                            value={showSizeOnDisk}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowTags')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showTags"
                            value={showTags}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowSearch')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showSearchAction"
                            value={showSearchAction}
                            helpText={translate('ShowSearchHelpText')}
                            onChange={onOverviewOptionChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default VolumeIndexOverviewOptionsModalContent;
