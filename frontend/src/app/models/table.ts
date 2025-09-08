import { Column } from './column';

export interface Table {
id?: number;
name: string;
owner_id?: number;
columns: Column[];
}
