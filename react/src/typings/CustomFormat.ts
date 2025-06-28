import { type ModelBase } from 'App/ModelBase';
import { type CustomFormatSpecification } from './CustomFormatSpecification';

export interface QualityProfileFormatItem {
    format: number;
    name: string;
    score: number;
}

export interface CustomFormat extends ModelBase {
    name: string;
    includeCustomFormatWhenRenaming: boolean;
    specifications: CustomFormatSpecification[];
}
