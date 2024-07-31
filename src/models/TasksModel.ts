export enum TaskStatus {
  Pending,
  Completed,
  Canceled,
}

export interface TasksModel {
  employee_id: string[];
  customer_id: string[];
  description: string;
  assigned_at: number | null;
  completed_at: number | null;
  status: TaskStatus;
  created_at: number;
  updated_at: number;
}
