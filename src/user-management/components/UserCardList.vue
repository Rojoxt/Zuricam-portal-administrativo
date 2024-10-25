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
          <v-col cols="auto">
            <v-btn type="success" color="secondary" prepend-icon="mdi-tray-arrow-up" class="ma-1" @click="exportCSV"> Export </v-btn>
          </v-col>
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
    <v-card prepend-icon="mdi-account" title="Perfil de usuario">
      <v-card-text>
        <v-text-field
          density="compact"
          label="Usuario*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="user.username"
        ></v-text-field>
        <v-text-field
          density="compact"
          label="Nombres*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="user.firstName"
        ></v-text-field>
        <v-text-field
          density="compact"
          label="Apellidos*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="user.lastName"
        ></v-text-field>
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
        <v-text-field
          density="compact"
          placeholder="correo@gmail.com"
          type="email"
          label="Correo*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="user.email"
          :rules="[rules.required, rules.validEmail]"
        ></v-text-field>

        <v-combobox
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
        </v-combobox>

        <v-row justify="center">
          <!-- Centra los botones -->
          <v-btn-toggle v-model="toggleActive" mandatory shaped color="success">
            <v-btn value="true"> Activado </v-btn>

            <v-btn value="false" color="error"> Desactivado </v-btn>
          </v-btn-toggle>
        </v-row>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>

        <small class="text-caption text-medium-emphasis">*Obligatorio</small>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Cerrar" variant="plain" @click="userDialog = false"></v-btn>
        <v-btn color="primary" text="Guardar" variant="tonal" @click="saveUser()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteUserDialog" max-width="400">
    <v-card prepend-icon="mdi-delete" title="Confirmacion">
      Estas seguro de Eliminar al usuario : {{ user.username }}
      <v-divider></v-divider>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="deleteUserDialog = false"></v-btn>
          <v-btn color="secondary" text="Confirmar" variant="tonal" @click="deleteDriver"></v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" top>
    <strong>{{ snackbarTitle }}</strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { UserService } from '@/user-management/services/user-service';
import { exportToExcel } from '@/core/utils/excelExporter';

const search = ref('');
const userService = new UserService();
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const newUser: CreateUserModel = {
  dni: 0,
  permissions: [],
  email: '',
  firstName: '',
  headquarter: '',
  lastName: '',
  username: '',
  isActive: true
};
const user = ref<CreateUserModel & { id?: number }>(newUser);

const toggleActive = computed({
  get: () => (user.value.isActive ? 'true' : 'false'), // Devuelve como string
  set: (value) => {
    user.value.isActive = value === 'true'; // Convierte a booleano
  }
});
const rules = {
  required: (value) => !!value || 'Este campo es requerido.',
  dniLength: (value) => (value && value.toString().length === 8) || 'El DNI debe tener exactamente 8 dígitos.',
  validEmail: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Ingrese un correo válido.';
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

const exportCSV = () => {
  exportToExcel(users.value);
};

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
    const response = await userService.resetPassword(user.value.id);

    // Mostrar mensaje de éxito con el detalle recibido del backend
    addToast('Éxito', `${response.data.detail}`, 'success');
  } catch (error) {
    // Manejar cualquier error durante el proceso de reseteo de contraseña
    if (error.response && error.response.data && error.response.data.detail) {
      addToast('Error', `${error.response.data.detail}`, 'error');
    } else {
      addToast('Error', 'Ha ocurrido un error al intentar resetear la contraseña.', 'error');
    }
  }
};

const saveUser = () => {
  const userResource = {
    username: user.value.username,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    dni: user.value.dni,
    headquarter: 0,
    permissions: user.value.permissions || [],
    isActive: user.value.isActive
  };

  if (user.value.username && user.value.firstName && user.value.lastName) {
    if (user.value.id) {
      userService.update(user.value.id, userResource).then((response) => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllUser();
      });
    } else {
      // new unit
      userService
        .create(userResource)
        .then((response) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllUser();
        })
        .catch((error) => {
          handleRequestError(error);
        });
    }
    userDialog.value = false;
    user.value = { ...newUser }; // Reinicia el objeto user
  } else {
    addToast('Error', 'Faltan datos', 'error');
  }
};

function handleRequestError(error: any): void {
  if (error.response) {
    // Verificar si es un error 400
    if (error.response.status === 400) {
      // Mostrar el mensaje de error específico
      addToast('Error', `${error.response.data.detail}`, 'error');
    } else {
      // Manejar otros errores (500, 404, etc.)
      addToast('Error', 'Ha ocurrido un error en el servidor.', 'error');
    }
  } else {
    // Error de red o de otra índole
    addToast('Error', 'Error de red. Intenta de nuevo.', 'error');
  }
}

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
  deleteUserDialog.value = true;
};

const deleteDriver = () => {
  // aseguro de que id existirá en tiempo de ejecución
  const id = (user.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  userService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllUser();
  });
  user.value = { ...newUser };
  deleteUserDialog.value = false;
};

const headers = [
  { key: 'username', title: 'Usuario' },
  { key: 'firstName', title: 'Nombre' },
  { key: 'lastName', title: 'Apellido' },
  { key: 'email', title: 'Correo' },
  { key: 'permissions', title: 'Permisos' },
  { key: 'isActive', title: 'Estado' },
  { key: 'actions', title: 'Acciones', sortable: false }
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
</script>

<style scoped lang="scss"></style>
