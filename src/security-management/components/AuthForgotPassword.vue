<script setup lang="ts">
import { ref } from 'vue';

import { AuthService } from '@/security-management/services/auth-service';
import { Form } from 'vee-validate';
import { router } from '@/router';
const email = ref('');
const apiError = ref<string | null>(null);
let dialog = ref(false);

const authService = new AuthService();
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

async function validate() {
  apiError.value = null; // Resetea el error antes de la validación
  try {
    await authService.resetPassword(email.value);
    dialog.value=true;
    await router.push('/auth/login');

    // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
  } catch (error) {
    switch (error.response.data.detail) {
      case 'Email not existed':
        apiError.value = 'Correo no existe';// Almacena el mensaje de error
        break;
    }
  }
}

</script>

<template>
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Ingrese su correo electrónico</h5>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ isSubmitting }">
    <v-text-field
      name="email"
      as="v-text-field"
      v-model="email"
      :rules="emailRules"
      label="Correo electrónico"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    />
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" type="submit">Recuperar contraseña</v-btn>
    <div v-if="apiError" class="mt-2">
      <v-alert color="error">{{ apiError }}</v-alert>
    </div>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Revisa tu bandeja de entrada"
        title="Exitoso"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Aceptar"
            @click="dialog = false"
            :to="{name:'Login'}"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </Form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/auth/login" class="mt-2 text-capitalize mr-n2">Recorde mi contraseña</v-btn>
  </div>
</template>

<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
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
</style>
