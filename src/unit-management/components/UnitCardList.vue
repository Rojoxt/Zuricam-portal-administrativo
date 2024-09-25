<template>
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
                   @click="exportCSV">Export
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card-title class="d-flex align-center me-2">

      <v-icon icon="mdi-bus-side" color="secondary"></v-icon> &nbsp; Gestión de buses

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
                  :items="units"
                  items-per-page="5"
    >
      <template v-slot:item.driverId="{ item }">
        {{ getNameDriver(item.driverId ?? 0) }}
      </template>
      <template v-slot:item.actions="{ item}">
        <v-btn size="small" class="ma-1 " color="primary" icon="mdi-pencil"
               @click="editUnit( {item : item}) "></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete"
               @click="confirmDeleteUnit({item : item})"></v-btn>
      </template>


    </v-data-table>
  </v-card>

  <v-dialog v-model="unitDialog" max-width="500">
    <v-card prepend-icon="mdi-account" title="Perfil de bus">

      <v-card-text>


        <v-text-field density="compact" label="Placa*" variant="outlined" color="secondary" required
                      v-model.trim="unit.carPlate"></v-text-field>
        <v-combobox
          density="compact"
          variant="outlined"
          color="secondary"
          v-model="unit.driverId"
          :items="drivers"
          item-title="name"
          item-value="id"
          label="Driver"
          :return-object='false'
          required
        >
        </v-combobox>
        <small class="text-caption text-medium-emphasis"
        >*indicates required field</small
        >
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="unitDialog = false"></v-btn>
        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="saveUnit({driver : unit})"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteUnitDialog" max-width="400">
    <v-card
      prepend-icon="mdi-delete"
      title="Confirmacion"
    >
      "Are you sure you want to delete {{ unit.carPlate }}"
      <v-divider></v-divider>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="deleteUnitDialog = false"></v-btn>
          <v-btn
            color="secondary"
            text="Confirmar"
            variant="tonal"
            @click="deleteDriver"
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
import { onMounted, ref, type UnwrapRef, watch } from 'vue';
import { UnitService } from '@/unit-management/services/unit-service';
import { exportToExcel } from '@/core/utils/excelExporter';
import { DriverService } from '@/unit-management/services/driver-service';


const search = ref('');
const unitService = new UnitService();
const driverService = new DriverService();
const unitDialog = ref(false);
const deleteUnitDialog = ref(false);
let unit = ref<Partial<UnitModel>>({});
let units = ref<UnitModel[]>([]);
let drivers = ref<DriverModel[]>([]);


//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');


onMounted(() => {
  getAllUnits();
  getAllDriver();

});

const exportCSV = () => {
  exportToExcel(units.value);
};

function getNameDriver(driverId: number) {
  const driver = drivers.value.find(driver => driver.id === driverId);
  return driver ? `${driver.name} ${driver.lastName}` : 'Driver not found';
}


async function getAllUnits() {
  const response = await unitService.getAll();
  units.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

async function getAllDriver() {
  const response = await driverService.getAll();
  drivers.value = response.data.result;

  console.log('Response data:', response.data.detail);
  console.log('Response data:', drivers);

}


const openNew = () => {
  unit.value = {};
  unitDialog.value = true;
};

const editUnit = ({ item }: { item: any }) => {
  unit.value = { ...item };
  unitDialog.value = true;

};
const saveUnit = (p: { driver: UnwrapRef<CreateUnitModel> }) => {
  const unitResource = {
    carPlate: unit.value.carPlate,
    driverId: unit.value.driverId
  };

  if (unit.value.carPlate && unit.value.carPlate.trim() && unit.value.driverId) {
    if (unit.value.id) {
      unitService.update(unit.value.id, unitResource).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllUnits();
      });
    } else {
      // new unit
      unitService.create(unitResource).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllUnits();
      });
    }
    unitDialog.value = false;
    unit.value = {}; // Reinicia el objeto unit
  } else {
    addToast('Error', 'Faltan datos', 'error');
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
  unit.value = { ...item };
  deleteUnitDialog.value = true;
};

const deleteDriver = () => {
  // aseguro de que id existirá en tiempo de ejecución
  let id = (unit.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  unitService.delete(id).then(response => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllUnits();
  });
  unit.value = { carPlate: '', driverId: 0 };
  deleteUnitDialog.value = false;

};


const headers = [
  { key: 'carPlate', title: 'Placa' },
  { key: 'driverId', title: 'Conductor Asignado' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];


</script>


<style scoped lang="scss">

</style>
