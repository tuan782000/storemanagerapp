export enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
}
export interface UserModel {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
