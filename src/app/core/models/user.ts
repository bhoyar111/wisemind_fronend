import { Role } from './role';

export class User {
  id: number;
  img: string;
  school_name: string;
  email_id: string;
  role_id: number;
  mobile_no: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  token?: string;
  status: number
}
