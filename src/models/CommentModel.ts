// Coment này chỉ staff gửi lên cho admin - chỉ mỗi admin đọc được
export interface CommentModel {
  employee_id: string;
  customer_id: string;
  comment: string;
  date: Date;
}
