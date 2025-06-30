import { type Quality } from 'Quality/Quality';

export interface QualityDefinition {
    id: number;
    quality: Quality;
    title: string;
    weight: number;
}
