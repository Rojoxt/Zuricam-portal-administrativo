import http from '../../core/services/http-common';

export class ReportService {
  getAll() {
    return http.get('/report');
  }

  getById(id: number) {
    return http.get(`/report/${id}`);
  }

  create(data: CreateReportModel) {
    return http.post('/report', data);
  }

  update(id: number, data: CreateReportModel) {
    return http.put(`/report/${id}`, data); // Corregido aquí
  }

  delete(id: number) {
    return http.delete(`/report/${id}`);
  }

  findByName(name: string) {
    return http.get(`/report?name=${name}`);
  }
}
