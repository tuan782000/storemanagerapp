export enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
}
export interface UserModel {
  email: string;
  password: string;
  name: string;
  phone: string;
  username: string;
  role: UserRole;
  created_at: number;
  updated_at: number;
}
