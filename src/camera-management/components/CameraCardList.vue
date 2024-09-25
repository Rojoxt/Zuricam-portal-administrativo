<template>
  <h1>CameraCardList</h1>
  <v-card flat class="pa-md-10 ">
    <v-card flat class="rounded-sm border-md">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn type="success" color="success" prepend-icon="mdi-plus" class="ma-1" @click="openNew ">Añadir
            </v-btn>

          </v-col>
          <v-col cols="auto">

          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn type="success" color="secondary" prepend-icon="mdi-tray-arrow-up" class="ma-1"
            >Import
            </v-btn>
            <v-btn type="success" color="secondary200" prepend-icon="mdi-tray-arrow-up" class="ma-1"
                   @click="exportCSV" >Export
            </v-btn>
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
    <v-data-table v-model:search="search"
                  :headers="headers"
                  :items="cameras"
                  items-per-page="5"
    >
      <template v-slot:item.unitId="{ item }">
        {{ getCarPlateUnit(item.unitId ?? 0)}}
      </template>
      <template v-slot:item.actions="{ item}">
        <v-btn size="small" class="ma-1 " color="primary" icon="mdi-pencil"
               @click="editCamera( {item : item}) "></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete"
               @click="confirmDeleteCamera({item : item})"></v-btn>
      </template>


    </v-data-table>
  </v-card>

  <v-dialog v-model="cameraDialog" max-width="500">
    <v-card prepend-icon="mdi-account" title="Perfil de camara">

      <v-card-text>
        <v-text-field density="compact" label="Nombre*" variant="outlined" color="secondary" required
                      v-model.trim="camera.name"></v-text-field>
        <v-text-field density="compact" v-model.trim="camera.location"  label="Ubicación*" variant="outlined"
                      color="secondary" required></v-text-field>
        <v-combobox
          density="compact"
          variant="outlined"
          color="secondary"
          modelValue="camera.unitId"
          :items="units"
          item-title="carPlate"
          item-value="id"
          label="Bus"
          :return-object='false'
          required
         >
        </v-combobox>
        <small class="text-caption text-medium-emphasis"
        >*indicates required field</small>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="cameraDialog = false"></v-btn>
        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="saveCamera({camera : camera})"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteCameraDialog" max-width="400" >
    <v-card
      prepend-icon="mdi-delete"
      title="Confirmacion"
    >
      "Are you sure you want to delete {{ camera.name }}"
      <v-divider></v-divider>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="deleteCameraDialog = false"></v-btn>
          <v-btn
            color="secondary"
            text="Confirmar"
            variant="tonal"
            @click="deleteCamera"
          ></v-btn>
        </v-card-actions>
      </template>
    </v-card>


  </v-dialog>


  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    variant="tonal"
    top
  >
    <strong>{{ snackbarTitle }}</strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { exportToExcel } from '@/core/utils/excelExporter';
import { CameraService } from '@/camera-management/services/camera-service';
import { UnitService } from '@/unit-management/services/unit-service';


const search = ref('');
const cameraService = new CameraService();
const unitService= new UnitService();
const cameraDialog = ref(false);
const deleteCameraDialog = ref(false);
const camera = ref<Partial<CameraModel>>({});
let cameras = ref<CameraModel[]>([]);
let units= ref<UnitModel[]>([]);

//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');

onMounted(() => {
  getAllCameras();
  getAllUnits()
});

const exportCSV = () => {
  exportToExcel(cameras.value)
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
  camera.value = {};
  cameraDialog.value = true;
};

const editCamera = ({ item }: { item: any }) => {
  camera.value = { ...item };
  cameraDialog.value = true;

};
function getCarPlateUnit(unitId: number) {
  const unit = units.value.find(unit => unit.id === unitId);
  return unit ? `${unit.carPlate} ` : 'Unit not found';
};
const saveCamera = ({ camera }: { camera: any }) => {
  const cameraResource = {
    name: camera.name,
    location: camera.location,
    unitId: camera.unitId,

  };


  if (camera.name && camera.name.trim() && camera.location && camera.unitId) {
    if (camera.id) {
      cameraService.update(camera.id, cameraResource).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllCameras()
      });
    } else {
      //new camera
      cameraService.create(camera).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllCameras()
      });

    }
    cameraDialog.value = false;
    camera.value = {};
  } else
    addToast('Error', 'Faltan datos', 'error');
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

const confirmDeleteCamera = ({ item }: { item: any }) => {
  camera.value = { ...item };
  deleteCameraDialog.value = true;
};

const deleteCamera=()=>{
  // aseguro de que id existirá en tiempo de ejecución
  let id = (camera.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  cameraService.delete(id).then(response => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllCameras()
  });
  camera.value = { name: '', location: '', unitId: 0};
  deleteCameraDialog.value = false;

}


const headers = [
  { key: 'name', title: 'Nombre' },
  { key: 'location', title: 'Lugar' },
  { key: 'unitId', title: 'unidad' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];
</script>



<style scoped lang="scss">

</style>
