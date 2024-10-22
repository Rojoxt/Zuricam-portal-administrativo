import http from '../../core/services/http-common';

export class AuthService {
  static async login(authModel: AuthModel) {
    return http.post('/auth/login', authModel);
  }

  async resetPassword(email: string) {
    const url = `/auth/reset-password?email=${encodeURIComponent(email)}`;
    return http.patch(url);
  }
}
