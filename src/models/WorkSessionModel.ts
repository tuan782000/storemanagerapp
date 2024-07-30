export interface MaintenanceSchedule {
  date: Date;
  notes: string;
}

export interface WorkSessionModel {
  employee_id: string;
  customer_id: string;
  start_time: Date;
  end_time: Date;
  result: string;
  amount: number; // Lưu ý ở điểm này 10.000 vnđ 1.000.0000 vnđ
  before_image_url: string;
  after_image_url: string;
  maintenance_schedule: MaintenanceSchedule;
  created_at: Date;
  updated_at: Date;
}
