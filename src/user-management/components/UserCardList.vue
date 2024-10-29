<template>
  <v-card flat class="pa-md-10">
    <v-card flat class="rounded-sm border-md">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn type="success" color="success" prepend-icon="mdi-plus" class="ma-1" @click="openNew">Añadir</v-btn>
          </v-col>
          <v-col cols="auto"></v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>

    <v-card-title class="d-flex align-center me-2">
      <v-icon icon="mdi-badge-account" color="secondary"></v-icon> &nbsp; Gestión de usuarios

      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table v-model:search="search" :headers="headers" :items="users" items-per-page="5">
      <template v-slot:item.permissions="{ item }">
        <v-chip
          v-if="item.permissions && item.permissions.length > 0"
          class="ma-2"
          :color="getPermission(item.permissions?.[0])?.color"
          label
        >
          <v-icon icon="mdi-label" start></v-icon>
          {{ getPermission(item.permissions?.[0])?.name }}
        </v-chip>

        <span v-else>No permissions</span>
      </template>

      <template v-slot:item.isActive="{ item }">
        <v-chip v-if="item.isActive !== undefined" class="ma-2" :color="item.isActive ? 'success' : 'error'" label>
          {{ item.isActive ? 'Activado' : 'Desactivado' }}
        </v-chip>
        <span v-else>No permissions</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" class="ma-1" color="secondary" icon="mdi-lock-reset" @click="resetPassword({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="primary" icon="mdi-pencil" @click="editUser({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete" @click="confirmDeleteUnit({ item: item })"></v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="userDialog" max-width="500">
    <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
      <v-card prepend-icon="mdi-account" title="Perfil de usuario">
        <v-card-text>
          <TextFieldUppercase
            density="compact"
            label="Usuario*"
            variant="outlined"
            color="secondary"
            required
            v-model.trim="user.username"
            :rules="[rules.required, rules.validString]"
          ></TextFieldUppercase>
          <TextFieldUppercase
            density="compact"
            label="Nombres*"
            variant="outlined"
            color="secondary"
            required
            v-model="user.firstName"
            :rules="[rules.required, rules.validString]"
          ></TextFieldUppercase>
          <TextFieldUppercase
            density="compact"
            label="Apellidos*"
            variant="outlined"
            color="secondary"
            required
            v-model="user.lastName"
            :rules="[rules.required, rules.validString]"
          ></TextFieldUppercase>
          <v-text-field
            density="compact"
            type="number"
            label="Dni*"
            variant="outlined"
            color="secondary"
            required
            v-model.trim="user.dni"
            :rules="[rules.required, rules.dniLength]"
          ></v-text-field>
          <TextFieldUppercase
            density="compact"
            placeholder="correo@gmail.com"
            type="email"
            label="Correo*"
            variant="outlined"
            color="secondary"
            required
            v-model.trim="user.email"
            :rules="[rules.required, rules.validEmail]"
          ></TextFieldUppercase>

          <v-select
            density="compact"
            variant="outlined"
            color="secondary"
            v-model="user.permissions[0]"
            :items="optionPermissions"
            item-title="name"
            item-value="index"
            label="Permiso"
            :return-object="false"
          >
          </v-select>

          <v-row justify="center">
            <!-- Centra los botones -->
            <v-btn-toggle v-model="toggleActive" mandatory shaped color="success">
              <v-btn value="true"> Activado</v-btn>

              <v-btn value="false" color="error"> Desactivado</v-btn>
            </v-btn-toggle>
          </v-row>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>

          <small class="text-caption text-medium-emphasis">*Obligatorio</small>
        </v-card-text>
        <v-divider></v-divider>
        <div v-if="errors.apiError" class="mt-2">
          <v-alert color="error" variant="tonal">{{ errors.apiError }}</v-alert>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="userDialog = false"></v-btn>
          <v-btn color="primary" :loading="isSubmitting" class="mt-2" variant="tonal" :disabled="!isFormValid" type="submit"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </Form>
  </v-dialog>
  <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" top>
    <strong>{{ snackbarTitle }}</strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { UserService } from '@/user-management/services/user-service';
import { Form } from 'vee-validate';
import TextFieldUppercase from '@/components/shared/TextFieldUppercase.vue';

const search = ref('');
const userService = new UserService();
const userDialog = ref(false);
const newUser: CreateUserModel = {
  dni: '',
  permissions: [0],
  email: '',
  firstName: '',
  headquarter: '',
  lastName: '',
  username: '',
  isActive: true
};
const userResource = ref<CreateUserModel | null>(null);
const user = ref<CreateUserModel & { id?: number }>(newUser);
const isFormValid = computed(() => {
  return (
    user.value.username &&
    user.value.firstName &&
    user.value.lastName &&
    user.value.dni &&
    user.value.email &&
    user.value.permissions[0] !== null &&
    rules.dniLength(user.value.dni) === true &&
    rules.validString(user.value.username) === true &&
    rules.validString(user.value.firstName) === true &&
    rules.validString(user.value.lastName) === true &&
    rules.validEmail(user.value.email)
  );
});
const toggleActive = computed({
  get: () => (user.value.isActive ? 'true' : 'false'), // Devuelve como string
  set: (value) => {
    user.value.isActive = value === 'true'; // Convierte a booleano
  }
});
const rules = {
  required: (value: string) => !!value || 'Este campo es requerido.',
  dniLength: (value: string) => (value && value.length === 8) || 'El DNI debe tener exactamente 8 dígitos.',
  validEmail: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Ingrese un correo válido.';
  },
  validString: (value: string) => {
    const pattern = /^[a-zA-Z\s ]+$/; // Solo letras de la 'a' a la 'z' (mayúsculas y minúsculas)
    return pattern.test(value) || 'Ingrese solo letras (a-z, A-Z).';
  }
};

const users = ref<UserModel[]>([]);

//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');

onMounted(() => {
  getAllUser();
});

async function getAllUser() {
  const response = await userService.getAll();
  users.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

const openNew = () => {
  user.value = { ...newUser };
  userDialog.value = true;
};

const editUser = ({ item }: { item: any }) => {
  user.value = { ...item, permissions: item.permissions || [] };
  userDialog.value = true;
};

const resetPassword = async ({ item }: { item: any }) => {
  try {
    // Establece el usuario seleccionado para el reseteo de contraseña
    user.value = { ...item };

    // Llamada asíncrona para resetear la contraseña
    const response = await userService.resetPassword(user.value.id ?? 1);

    // Mostrar mensaje de éxito con el detalle recibido del backend
    addToast('Éxito', `${response.data.detail}`, 'success');
  } catch (error: any) {
    // Manejar cualquier error durante el proceso de reseteo de contraseña
    if (error.response && error.response.data && error.response.data.detail) {
      addToast('Error', `${error.response.data.detail}`, 'error');
    } else {
      addToast('Error', 'Ha ocurrido un error al intentar resetear la contraseña.', 'error');
    }
  }
};

function addToast(title: string, message: string, color: string): void {
  snackbarTitle.value = title;
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000);
}

const confirmDeleteUnit = ({ item }: { item: any }) => {
  user.value = { ...item, permissions: [...item.permissions] };
  const id = (user.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  userService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllUser();
  });
  user.value = { ...newUser };
};
const headers = [
  { key: 'username', title: 'USUARIO' },
  { key: 'firstName', title: 'NOMBRES' },
  { key: 'lastName', title: 'APELLIDOS' },
  { key: 'email', title: 'CORREO' },
  { key: 'dni', title: 'DNI' },
  { key: 'permissions', title: 'PERMISO' },
  { key: 'isActive', title: 'ESTADO' },
  { key: 'actions', title: 'ACCIONES', sortable: false }
];
const optionPermissions = [
  { index: 0, name: 'Jefe', color: '#039BE5' },
  { index: 1, name: 'Administrador', color: '#E57373' },
  { index: 2, name: 'Agente', color: '#1B5E20' }
];

function getPermission(indexToFind: number) {
  const option = optionPermissions.find((option) => option.index === indexToFind);
  return option ? { ...option } : null; // Retorna una copia del objeto si lo encuentra, o null si no lo encuentra
}

function validate(values: any, { setErrors }: any) {
  userResource.value = {
    username: user.value.username,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    dni: user.value.dni,
    headquarter: '0',
    permissions: user.value.permissions || [],
    isActive: user.value.isActive
  };

  if (user.value.username && user.value.firstName && user.value.lastName) {
    if (user.value.id) {
      console.log('usuario actualizar:');
      return userService
        .update(user.value.id, userResource.value)
        .then((response) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllUser();
          // Mover estas líneas aquí
          userDialog.value = false; // Ahora solo se ejecutará después de una actualización exitosa
          user.value = { ...newUser }; // Ahora solo se ejecutará después de una actualización exitosa
        })
        .catch((error) => {
          if (error.response) {
            setErrors({ apiError: error.response.data.detail });
          } else {
            console.error('Error sin respuesta de servidor:', error);
            setErrors({ apiError: 'Error de conexión con el servidor' });
          }
        });
    } else {
      // nuevo usuario
      return userService
        .create(userResource.value)
        .then((response) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllUser();
          // Mover estas líneas aquí
          userDialog.value = false; // Ahora solo se ejecutará después de una creación exitosa
          user.value = { ...newUser }; // Ahora solo se ejecutará después de una creación exitosa
        })
        .catch((error) => {
          if (error.response) {
            setErrors({ apiError: error.response.data.detail });
          } else {
            console.error('Error sin respuesta de servidor:', error);
            setErrors({ apiError: 'Error de conexión con el servidor' });
          }
        });
    }
  } else {
    setErrors({ apiError: 'Error: faltan datos' });
  }
}
</script>

<style scoped lang="scss"></style>
