export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}