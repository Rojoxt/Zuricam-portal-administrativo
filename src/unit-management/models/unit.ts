interface CreateUnitModel {
  carPlate?: string;
  driverId?: number;
}

interface UnitModel extends CreateUnitModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}
