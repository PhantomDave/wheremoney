export const COLUMN_TYPES = ['string', 'number', 'boolean', 'date'] as const;

export type ColumnType = (typeof COLUMN_TYPES)[number];

export interface Column {
  id?: number;
  tableId: number;
  name: string;
  data_type: ColumnType;
}

export const isColumnType = (v: unknown): v is ColumnType =>
  typeof v === 'string' && (COLUMN_TYPES as readonly string[]).includes(v);
