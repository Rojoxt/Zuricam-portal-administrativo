import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth1',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user1: JSON.parse(localStorage.getItem('user1')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      const user1 = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      // update pinia state
      this.user1 = user1;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user1', JSON.stringify(user1));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/dashboard/default');
    },
    logout() {
      this.user1 = null;
      localStorage.removeItem('user1');
      router.push('/auth/login');
    }
  }
});
