// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setVolumePosterOption } from 'Store/Slices/VolumeIndex';

// Misc
import { inputTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Types
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { VolumeColumnName } from 'Volume/Volume';

interface VolumeIndexPosterOptionsModalContentProps {
    onModalClose(...args: unknown[]): unknown;
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

export default function VolumeIndexPosterOptionsModalContent({
    onModalClose,
}: VolumeIndexPosterOptionsModalContentProps) {
    const {
        detailedProgressBar,
        size,
        showFolder,
        showMonitored,
        showSearchAction,
        showSizeOnDisk,
        showTitle,
    } = useRootSelector((state) => state.volumeIndex.posterOptions);

    const dispatch = useRootDispatch();

    const onPosterOptionChange = useCallback(
        ({ name, value }: { name: string; value: unknown }) => {
            const payload = {
                [name]: value,
            } as Partial<TableOptionsChangePayload<VolumeColumnName>>;
            dispatch(setVolumePosterOption(payload));
        },
        [dispatch],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('PosterOptions')}</ModalHeader>

            <ModalBody>
                <Form>
                    <FormGroup>
                        <FormLabel>{translate('PosterSize')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.SELECT}
                            name="size"
                            value={size}
                            values={posterSizeOptions}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            {translate('DetailedProgressBar')}
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="detailedProgressBar"
                            value={detailedProgressBar}
                            helpText={translate('DetailedProgressBarHelpText')}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowTitle')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showTitle"
                            value={showTitle}
                            helpText={translate('ShowVolumeTitleHelpText')}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowMonitored')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showMonitored"
                            value={showMonitored}
                            helpText={translate('ShowMonitoredHelpText')}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowSizeOnDisk')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showSizeOnDisk"
                            value={showSizeOnDisk}
                            helpText={translate('ShowSizeOnDiskHelpText')}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowFolder')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showFolder"
                            value={showFolder}
                            helpText={translate('ShowFolderHelpText')}
                            onChange={onPosterOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ShowSearch')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="showSearchAction"
                            value={showSearchAction}
                            helpText={translate('ShowSearchHelpText')}
                            onChange={onPosterOptionChange}
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
