import http from '../../core/services/http-common';

export class DriverService {
  getAll() {
    return http.get('/drivers');
  }

  getById(id: number) {
    return http.get(`/drivers/${id}`);
  }

  create(data: CreateDriverModel) {
    return http.post('/drivers', data);
  }

  update(id: number, data: CreateDriverModel) {
    return http.put(`/drivers/${id}`, data); // Corregido aquí
  }

  delete(id: number) {
    return http.delete(`/drivers/${id}`);
  }

  findByName(name: string) {
    return http.get(`/drivers?name=${name}`);
  }
}
