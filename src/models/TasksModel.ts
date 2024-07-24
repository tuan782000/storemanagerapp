export enum TaskStatus {
  Completed = 'completed',
  Pending = 'pending',
}

export interface TasksModel {
  id: string;
  employee_id: string;
  customer_id: string;
  description: string;
  assigned_at: Date;
  completed_at: Date;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}
