import {RoleModel} from './role.model';

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  role: RoleModel;
  identityCardImage?: string;
}
