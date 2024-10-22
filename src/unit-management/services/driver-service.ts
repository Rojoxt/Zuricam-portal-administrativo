import http from '../../core/services/http-common';

export class DriverService {
  getAll() {
    return http.get('/driver');
  }

  getById(id: number) {
    return http.get(`/driver/${id}`);
  }

  create(data: CreateDriverModel) {
    return http.post('/driver', data);
  }

  update(id: number, data: CreateDriverModel) {
    return http.put(`/driver/${id}`, data); // Corregido aquí
  }

  delete(id: number) {
    return http.delete(`/driver/${id}`);
  }

  findByName(name: string) {
    return http.get(`/driver?name=${name}`);
  }
}
