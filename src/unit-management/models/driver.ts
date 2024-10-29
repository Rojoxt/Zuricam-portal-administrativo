interface CreateDriverModel {
  name?: string;
  lastName?: string;
  dni?: number;
}

interface DriverModel extends CreateDriverModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}
