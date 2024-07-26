export enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
}
export interface UserModel {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  created_at: number;
  updated_at: number;
}
