export enum TaskStatus {
  Assigned, // đã giao
  Accepted, // đã chấp nhận
  Pending, // đang xử lý
  Rejected, // từ chối nhiệm vụ
  Completed, // hoàn thành
}

type WorkSession = {
  customer_id: string[];
  employee_id: string[];
  start_time?: Date | null;
  end_time?: Date | null;
  result?: string | null;
  amount: number;
  payment_amount?: number;
  before_image?: string[];
  after_image?: string[];
  description: string;
  status?: TaskStatus;
  rejection_reason?: string | null;
  created_at?: Date;
  updated_at?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  maintenance_schedule?: string[];
  comments?: string[];
};

export default WorkSession;
