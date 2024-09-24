import { defineStore } from 'pinia';
import { AuthService } from '../services/auth-service';


// Helper function to get the auth token from localStorage


export const useAuthStore = defineStore('auth',{
    state: () => ({
      user: JSON.parse(localStorage.getItem('user')|| 'null'),
      returnUrl: null
    }),


  actions: {
    async login(authModel: AuthModel) {
      try {
        // Authenticate user and get user data
        const response = await AuthService.login(authModel);
        const user = response.data;

        // Update Pinia state
        this.user = user;

        // Store user details and JWT in local storage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to previous URL or default to home page
        await router.push(this.returnUrl || '/dashboard/default');
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;

      // Remove token and token type from localStorage
      localStorage.removeItem('user');
      router.push('/auth/login');
    },

    // Optionally, add a method to check if the user is authentica
  },
});
