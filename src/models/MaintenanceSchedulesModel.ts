// Lịch bảo trì công việc
export interface MaintenanceScheduleModel {
  customer_id: string[];
  employee_id: string[];
  work_session_id: string[];
  scheduled_date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
