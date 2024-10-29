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
      <v-icon icon="mdi-camera" color="secondary"></v-icon> &nbsp; Gestión de cámaras

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
          <TextFieldUppercase
            density="compact"
            label="Nombre*"
            variant="outlined"
            color="secondary"
            v-model.trim="camera.name"
            required
          ></TextFieldUppercase>
          <v-checkbox
            v-model="realTimeLocation"
            label="Ubicación en tiempo real"
            color="secondary"
          ></v-checkbox>
          <v-text-field
            v-if="realTimeLocation"
            density="compact"
            v-model.trim="camera.location"
            label="Ubicación*"
            variant="outlined"
            color="secondary"
            :rules="[rules.required, rules.validateLocation]"
            required
          ></v-text-field>
          <v-select
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
          </v-select>
          <v-text-field
            density="compact"
            v-model.trim="camera.url"
            label="Url*"
            variant="outlined"
            color="secondary"
            :rules="[rules.required, rules.validateUrl]"
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
import { computed, onMounted, ref, watch } from "vue";
import { CameraService } from '@/camera-management/services/camera-service';
import { UnitService } from '@/unit-management/services/unit-service';
import { validate } from '@/core/validators/validators';
import { Form } from 'vee-validate';
import TextFieldUppercase from '@/components/shared/TextFieldUppercase.vue';

const realTimeLocation = ref(false);
const search = ref('');
const cameraService = new CameraService();
const unitService = new UnitService();
const cameraDialog = ref(false);
const newCamera: CreateCameraModel = {
  name: '',
  location: 'No tiene ubicación en tiempo real',
  url: '',
  unitId: 1
};
const camera = ref<CreateCameraModel & { id?: number }>(newCamera);
const cameras = ref<CameraModel[]>([]);
const units = ref<UnitModel[]>([]);
const isFormValid = computed(() => {
  return (
    camera.value.name &&
    camera.value.location &&
    camera.value.url &&
    camera.value.unitId &&
    rules.validateUrl(camera.value.url) === true &&
    rules.validateLocation(camera.value.location)
  );
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');
const cameraResource = ref<CreateCameraModel | null>(null);
watch(realTimeLocation, (newValue) => {
  if (!newValue) {
    camera.value.location = 'No tiene ubicación en tiempo real';
  }else camera.value.location = '';
});

const rules = {
  required: (value: string) => !!value || 'Este campo es requerido.',
  dniLength: (value: number) => (value && value.toString().length === 8) || 'El DNI debe tener exactamente 8 dígitos.',
  validateUrl: (value: string) => {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    // Expresión regular para validar IP (IPv4)
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (value === '0') return true; // Permitir "0"
    if (urlPattern.test(value) || ipPattern.test(value)) return true; // Permitir URL o IP
    return 'Debe ingresar una URL válida, una dirección IP o "0" en caso contrario".'; // Mensaje de error si es inválido
  },
  validateLocation: (value: string) => {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (value === 'No tiene ubicación en tiempo real') return true;
    return urlPattern.test(value) || 'Ingresar una URL válida';
  }
};

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
  if (item.location !=='No tiene ubicación en tiempo real') {
    realTimeLocation.value=true;
    camera.value.location = item.location;
    cameraDialog.value = true;}
  else{
    realTimeLocation.value=false;
    cameraDialog.value = true;
  }
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
  { key: 'name', title: 'NOMBRE' },
  { key: 'location', title: 'LUGAR' },
  { key: 'unitId', title: 'BUS' },
  { key: 'url', title: 'URL' },
  { key: 'actions', title: 'ACCIONES', sortable: false }
];
</script>

<style scoped lang="scss"></style>
