<script setup lang="ts">
import { ref } from 'vue';

//import { useAuthStore } from '@/stores/auth';
import { useAuthStore } from '@/security-management/stores/auth-store';
import { Form } from 'vee-validate';
import TextFieldUppercase from "@/components/shared/TextFieldUppercase.vue";

const valid = ref(false);
const show1 = ref(false);
//const logform = ref();
const password = ref('');
const username = ref('');
const passwordRules = ref([
  (v: string) => !!v || 'Se requiere contraseña',
  (v: string) => (v && v.length <= 13) || 'Password must be less than 10 characters'
]);
const emailRules = ref([(v: string) => !!v || 'Se requiere correo', (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido']);

/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();

  return authStore.login({ email: username.value, password: password.value }).catch((error) => {
    if (error.response) {
      setErrors({ apiError: error.response.data.detail });
    } else {
      console.error('Error sin respuesta de servidor:', error);
      setErrors({ apiError: 'Error de conexión con el servidor' });
    }
  });
}
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />

      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <TextFieldUppercase
      v-model="username"
      :rules="emailRules"
      label="Correo Electrónico / Usuario"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></TextFieldUppercase>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Contraseña"
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

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0"></div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      Iniciar Sesión
    </v-btn>
    <a href="http://www.mediafire.com/file/0yom6m5r76m4qkw/ZuriCam.7z" target="_blank" style="text-decoration: none">
      <h5 class="text-h5 text-center my-4 mb-8">Descargar aplicación de monitoreo</h5>
    </a>

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
