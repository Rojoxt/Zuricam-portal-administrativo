import http from '../../core/services/http-common';

export class UserService {
  getAll() {
    return http.get('/user');
  }

  getById(id: number) {
    return http.get(`/user/${id}`);
  }

  create(data: CreateUserModel) {
    return http.post('/user', data);
  }

  update(id: number, data: CreateUserModel) {
    return http.put(`/user/${id}`, data); //
  }

  delete(id: number) {
    return http.delete(`/user/${id}`);
  }

  findByName(name: string) {
    return http.get(`/user?name=${name}`);
  }
  resetPassword(id: number) {
    return http.patch(`/user?id=${id}`);
  }
}
