interface CreateCameraModel {
  name?: string;
  location?: string;
  url?: string;
  unitId: number;
}

interface CameraModel extends CreateCameraModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}
