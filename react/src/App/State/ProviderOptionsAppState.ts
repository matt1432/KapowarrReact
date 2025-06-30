import { type AppSectionState } from 'App/State/AppSectionState';
import { type Field, type FieldSelectOption } from 'typings/Field';

export interface ProviderOptions {
    fields?: Field[];
}

interface ProviderOptionsDevice {
    id: string;
    name: string;
}

export interface ProviderOptionsAppState {
    devices: AppSectionState<ProviderOptionsDevice>;
    servers: AppSectionState<FieldSelectOption<unknown>>;
    newznabCategories: AppSectionState<FieldSelectOption<unknown>>;
    getProfiles: AppSectionState<FieldSelectOption<unknown>>;
    getTags: AppSectionState<FieldSelectOption<unknown>>;
    getRootFolders: AppSectionState<FieldSelectOption<unknown>>;
}
