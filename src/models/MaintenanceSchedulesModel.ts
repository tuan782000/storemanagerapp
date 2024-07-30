export interface MaintenanceScheduleModel {
  customer_id: string;
  employee_id: string;
  scheduled_date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
