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
      <v-icon icon="mdi-camera" color="secondary"></v-icon> &nbsp; Gestión de camaras

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
    <v-data-table v-model:search="search" :headers="headers" :items="cameras" items-per-page="5">
      <template v-slot:item.unitId="{ item }">
        {{ getCarPlateUnit(item.unitId ?? 0) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" class="ma-1" color="primary" icon="mdi-pencil" @click="editCamera({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete" @click="confirmDeleteCamera({ item: item })"></v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="cameraDialog" max-width="500">
    <Form @submit="handleSubmit" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
      <v-card prepend-icon="mdi-account" title="Perfil de camara">
        <v-card-text>
          <v-text-field
            density="compact"
            label="Nombre*"
            variant="outlined"
            color="secondary"
            required
            v-model.trim="camera.name"
          ></v-text-field>
          <v-text-field
            density="compact"
            v-model.trim="camera.location"
            label="Ubicación*"
            variant="outlined"
            color="secondary"
            required
          ></v-text-field>
          <v-combobox
            density="compact"
            variant="outlined"
            color="secondary"
            v-model="camera.unitId"
            :items="units"
            item-title="carPlate"
            item-value="id"
            label="Bus"
            :return-object="false"
            required
          >
          </v-combobox>
          <v-text-field
            density="compact"
            v-model.trim="camera.url"
            label="Url*"
            variant="outlined"
            color="secondary"
            required
          ></v-text-field>
          <small class="text-caption text-medium-emphasis">* obligatorio</small>
        </v-card-text>
        <v-divider></v-divider>
        <div v-if="errors.apiError" class="mt-2">
          <v-alert color="error" variant="tonal">{{ errors.apiError }}</v-alert>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="cameraDialog = false"></v-btn>
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
import { exportToExcel } from '@/core/utils/excelExporter';
import { CameraService } from '@/camera-management/services/camera-service';
import { UnitService } from '@/unit-management/services/unit-service';
import { validate } from '@/core/validators/validators';
import { Form } from 'vee-validate';

const search = ref('');
const cameraService = new CameraService();
const unitService = new UnitService();
const cameraDialog = ref(false);
const newCamera: CreateCameraModel = {
  name: '',
  location: '',
  url: '',
  unitId: 1
};
const camera = ref<CreateCameraModel & { id?: number }>(newCamera);
const cameras = ref<CameraModel[]>([]);
const units = ref<UnitModel[]>([]);
const valid = ref(false);
//const cameraResource = ref<CreateCameraModel | null>(null);
//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');
const cameraResource = ref<CreateCameraModel | null>(null);

const closeDialog = () => {
  cameraDialog.value = false;
};
const handleSubmit = async (values: any, { setErrors }: any) => {
  cameraResource.value = {
    name: camera.value.name,
    location: camera.value.location,
    url: camera.value.url,
    unitId: camera.value.unitId
  };
  await validate(cameraService, camera, cameraResource, setErrors, addToast, closeDialog, getAllCameras);
};

onMounted(() => {
  getAllCameras();
  getAllUnits();
});

const exportCSV = () => {
  exportToExcel(cameras.value);
};

async function getAllUnits() {
  const response = await unitService.getAll();
  units.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

async function getAllCameras() {
  const response = await cameraService.getAll();
  cameras.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

const openNew = () => {
  camera.value = { ...newCamera };
  cameraDialog.value = true;
};

const editCamera = ({ item }: { item: any }) => {
  camera.value = { ...item };
  cameraDialog.value = true;
};

function getCarPlateUnit(unitId: number) {
  const unit = units.value.find((unit) => unit.id === unitId);
  return unit ? `${unit.carPlate} ` : 'Unit not found';
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

const confirmDeleteCamera = ({ item }: { item: any }) => {
  camera.value = { ...item };
  const id = (camera.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  cameraService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllCameras();
  });
  camera.value = { ...newCamera };
};


const headers = [
  { key: 'name', title: 'Nombre' },
  { key: 'location', title: 'Lugar' },
  { key: 'unitId', title: 'unidad' },
  { key: 'url', title: 'url' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];
</script>

<style scoped lang="scss"></style>
