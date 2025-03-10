import { ObjectId } from 'mongodb';
import { UserRoleType } from './createUser';

export interface UserProfileType {
  _id: ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  darkTheme: boolean;
  role: UserRoleType;
}
