<script setup lang="ts">
import { ref } from 'vue';

//import { useAuthStore } from '@/stores/auth';
import { useAuthStore } from '@/security-management/stores/auth-store';
import { Form } from 'vee-validate';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
//const logform = ref();
const password = ref('admin123');
const username = ref('info@codedthemes.com');
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length <= 13) || 'Password must be less than 10 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();

  return authStore
    .login({ email: username.value, password: password.value })
    .catch((error) => setErrors({ apiError: error.response.data.detail }));
}
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />

      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Iniciar sesión con dirección de correo electrónico</h5>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="username"
      :rules="emailRules"
      label="Email Address / Username"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="Remember me?"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>

      <div class="ml-auto">
        <v-btn variant="plain" :to="{ name: 'ForgotPassword' }" class="mt-2 text-capitalize mr-n2">¿Recuperar contraseña?</v-btn>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      Iniciar Sesión</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="lighterror">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
  <div class="mt-5 text-right">
    <v-divider />
  </div>
</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
