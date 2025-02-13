import { UserRoleType } from './createUser';

export interface UserProfileType {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  darkTheme: boolean;
  role: UserRoleType;
}
