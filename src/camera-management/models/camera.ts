interface CreateCameraModel {
  name?: string;
  location?: string;
  unitId?: number;
}

interface CameraModel extends CreateCameraModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}
