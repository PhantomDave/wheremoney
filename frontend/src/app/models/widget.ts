import { NgGridStackWidget } from 'gridstack/dist/angular';

export interface Widget extends Omit<NgGridStackWidget, 'id'> {
  id?: number;
  description?: string;
  name: string;
  type: WidgetType;
  widget_data: string;
  table_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WidgetData {
  category: string;
  value: string;
}

export enum WidgetType {
  BAR_CHART = 'Bar Chart',
  LINE_CHART = 'Line Chart',
  PIE_CHART = 'Pie Chart',
  TABLE = 'Table',
  NUMBER_CARD = 'Number Card',
}
