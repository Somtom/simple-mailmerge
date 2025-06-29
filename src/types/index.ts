export interface PlaceholderData {
  placeholder: string;
  excelColumn?: string;
  sampleValue?: string;
}

export interface ExcelColumn {
  name: string;
  sampleValue: string;
}

export interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface MergeData {
  [key: string]: string | number;
}
