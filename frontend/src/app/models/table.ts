import { Column } from './column';

export interface Table {
id?: number;
columns: Column[];
name: string;

}
