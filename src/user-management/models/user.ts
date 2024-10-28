interface CreateUserModel {
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  headquarter: string;
  permissions: number[];
  isActive: boolean;
}

interface UserModel extends CreateUserModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}
