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
                   @click="exportCSV" >Export
            </v-btn>
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
    <v-data-table v-model:search="search"
                  :headers="headers"
                  :items="drivers"
                  items-per-page="5"
    >
      <template v-slot:item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded>
          <v-img
            :src="`${item.image}`"
            height="64"
            cover
          ></v-img>
        </v-card>
      </template>
      <template v-slot:item.actions="{ item}">
        <v-btn size="small" class="ma-1 " color="primary" icon="mdi-pencil"
               @click="editDriver( {item : item}) "></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete"
               @click="confirmDeleteProduct({item : item})"></v-btn>
      </template>


    </v-data-table>
  </v-card>

  <v-dialog v-model="driverDialog" max-width="500">
    <v-card prepend-icon="mdi-account" title="Perfil de conductor">

      <v-card-text>
        <v-combobox
          density="compact"
          label="Conductor*"
          :items="drivers"
          item-text="name"
          variant="outlined"
          color="secondary" required
        ></v-combobox>


        <v-text-field density="compact" label="Nombre*" variant="outlined" color="secondary" required
                      v-model.trim="driver.name"></v-text-field>
        <v-text-field density="compact" v-model.trim="driver.lastName"  label="Apellido*" variant="outlined"
                      color="secondary" required></v-text-field>
        <v-text-field density="compact" v-model.trim="driver.dni" label="DNI*" variant="outlined" color="secondary"
                      required type="number"
                      :rules="[v => /^\d{8}$/.test(v) || 'El DNI debe tener exactamente 8 números']"></v-text-field>
        <v-text-field density="compact" v-model.trim="driver.image" label="Imagen url*" variant="outlined"
                      color="secondary" required></v-text-field>

        <small class="text-caption text-medium-emphasis"
        >*indicates required field</small
        >
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="driverDialog = false"></v-btn>
        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="saveDriver({driver : driver})"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDriverDialog" max-width="400" >
    <v-card
      prepend-icon="mdi-delete"
      title="Confirmacion"
    >
      "Are you sure you want to delete {{ driver.name }}"
      <v-divider></v-divider>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="deleteDriverDialog = false"></v-btn>
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
import { onMounted, ref } from 'vue';
import { DriverService } from '@/unit-management/services/driver-service';
import { exportToExcel } from '@/core/utils/excelExporter';


const search = ref('');
const driverService = new DriverService();
const driverDialog = ref(false);
const deleteDriverDialog = ref(false);
const driver = ref<CreateDriverModel>({});
let drivers = ref<DriverModel[]>([]);

//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');


onMounted(() => {
  getAllDrivers();
});

const exportCSV = () => {
  exportToExcel(drivers.value)
};

async function getAllDrivers() {
  const response = await driverService.getAll();
  drivers.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

const openNew = () => {
  driver.value = {};
  driverDialog.value = true;
};

const editDriver = ({ item }: { item: any }) => {
  driver.value = { ...item };
  driverDialog.value = true;

};
const saveDriver = ({ driver }: { driver: any }) => {
  const driverResource = {
    dni: driver.dni,
    image: driver.image,
    lastName: driver.lastName,
    name: driver.name
  };


  if (driver.name && driver.name.trim() && driver.lastName && driver.dni) {
    if (driver.id) {
      driverService.update(driver.id, driverResource).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllDrivers()
      });
    } else {
      //new driver
      driverService.create(driver).then(response => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllDrivers()
      });

    }
    driverDialog.value = false;
    driver.value = {};
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

const confirmDeleteProduct = ({ item }: { item: any }) => {
  driver.value = { ...item };
  deleteDriverDialog.value = true;
};

const deleteDriver=()=>{
  // aseguro de que id existirá en tiempo de ejecución
  let id = (driver.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  driverService.delete(id).then(response => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllDrivers()
  });
  driver.value = { dni: 0, image: '', lastName: '', name: '' };
  deleteDriverDialog.value = false;

}


const headers = [
  { key: 'name', title: 'Nombre' },
  { key: 'lastName', title: 'Apellido' },
  { key: 'dni', title: 'DNI' },
  { key: 'image', title: 'Imagen' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];
</script>

<style scoped lang="scss"></style>
