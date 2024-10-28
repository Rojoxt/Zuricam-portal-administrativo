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
      <v-icon icon="mdi-card-account-details" color="secondary"></v-icon> &nbsp; Gestión de conductores

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
    <v-data-table v-model:search="search" :headers="headers" :items="drivers" items-per-page="5">
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" class="ma-1" color="primary" icon="mdi-pencil" @click="editDriver({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete" @click="confirmDeleteProduct({ item: item })"></v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="driverDialog" max-width="500">
    <Form @submit="handleSubmit" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
      <v-card prepend-icon="mdi-account" title="Perfil de conductor">
        <v-card-text>
          <v-text-field
            density="compact"
            label="Nombre*"
            variant="outlined"
            color="secondary"
            required
            v-model.trim="driver.name"
          ></v-text-field>
          <v-text-field
            density="compact"
            v-model.trim="driver.lastName"
            label="Apellido*"
            variant="outlined"
            color="secondary"
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            v-model.trim="driver.dni"
            label="DNI*"
            variant="outlined"
            color="secondary"
            required
            type="number"
            :rules="[(v) => /^\d{8}$/.test(v) || 'El DNI debe tener exactamente 8 números']"
          ></v-text-field>
          <small class="text-caption text-medium-emphasis">* obligatorio</small>
        </v-card-text>
        <v-divider></v-divider>
        <div v-if="errors.apiError" class="mt-2">
          <v-alert color="error" variant="tonal">{{ errors.apiError }}</v-alert>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="driverDialog = false"></v-btn>
          <v-btn color="primary" :loading="isSubmitting" class="mt-2" variant="tonal" :disabled="valid" type="submit"> Guardar </v-btn>
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
import { onMounted, ref } from 'vue';
import { DriverService } from '@/unit-management/services/driver-service';
import { validate } from '@/core/validators/validators';
import { Form } from 'vee-validate';

const search = ref('');
const driverService = new DriverService();
const driverDialog = ref(false);
const newDriver: CreateDriverModel = {
  name: '',
  lastName: '',
  dni: 0
};
const valid = ref(false);
const driver = ref<CreateDriverModel>({});
const drivers = ref<DriverModel[]>([]);
const driverResource = ref<CreateDriverModel | null>(null);
//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');

onMounted(() => {
  getAllDrivers();
});
const closeDialog = () => {
  driverDialog.value = false;
};
const handleSubmit = async (values: any, { setErrors }: any) => {
  driverResource.value = {
    name: driver.value.name,
    lastName: driver.value.lastName,
    dni: driver.value.dni
  };
  await validate(driverService, driver, driverResource, setErrors, addToast, closeDialog, getAllDrivers);
};

const exportCSV = () => {
  exportToExcel(drivers.value);
};

async function getAllDrivers() {
  const response = await driverService.getAll();
  drivers.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

const openNew = () => {
  driver.value = { ...newDriver};
  driverDialog.value = true;
};

const editDriver = ({ item }: { item: any }) => {
  driver.value = { ...item };
  driverDialog.value = true;
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

const confirmDeleteProduct = ({ item }: { item: any }) => {
  driver.value = { ...item };
  const id = (driver.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  driverService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllDrivers();
  });
  driver.value = { ...newDriver };
};

const headers = [
  { key: 'name', title: 'Nombre' },
  { key: 'lastName', title: 'Apellido' },
  { key: 'dni', title: 'DNI' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];
</script>

<style scoped lang="scss"></style>
