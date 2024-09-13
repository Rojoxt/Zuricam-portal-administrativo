import http from '../../core/services/http-common';

export class CameraService {
  getAll() {
    return http.get('/camera');
  }

  getById(id: number) {
    return http.get(`/camera/${id}`);
  }

  create(data: CreateUnitModel) {
    return http.post('/camera', data);
  }

  update(id: number, data: CreateUnitModel) {
    return http.put(`/camera/${id}`, data); // Corregido aquí
  }

  delete(id: number) {
    return http.delete(`/camera/${id}`);
  }

  findByName(name: string) {
    return http.get(`/camera?name=${name}`);
  }


}
