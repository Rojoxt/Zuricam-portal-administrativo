import http from '../../core/services/http-common';

export class UnitService {
  getAll() {
    return http.get('/unit');
  }

  getById(id: number) {
    return http.get(`/unit/${id}`);
  }

  create(data: CreateUnitModel) {
    return http.post('/unit', data);
  }

  update(id: number, data: CreateUnitModel) {
    return http.put(`/unit/${id}`, data); // Corregido aquí
  }

  delete(id: number) {
    return http.delete(`/unit/${id}`);
  }

  findByName(name: string) {
    return http.get(`/unit?name=${name}`);
  }


}
