import { type ModelBase } from 'App/ModelBase';

export interface Task extends ModelBase {
    name: string;
    taskName: string;
    interval: number;
    lastExecution: string;
    lastStartTime: string;
    nextExecution: string;
    lastDuration: string;
}
