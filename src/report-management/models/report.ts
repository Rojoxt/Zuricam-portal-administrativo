interface CreateReportModel {
  address?: string;
  incident?: string;
  trackingLink?: string;
  image?: string;
  unitId?: number;
}

interface ReportModel extends CreateReportModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}
