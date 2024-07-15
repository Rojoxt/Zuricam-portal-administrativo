interface CreateDriverModel {
  name?: string;
  lastName?: string;
  dni?: number;
  image?: string;
}

interface DriverModel extends CreateDriverModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}

