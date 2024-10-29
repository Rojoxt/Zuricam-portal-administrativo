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
    <v-data-table v-model:search="search" :headers="headers" :items="units" items-per-page="5">
      <template v-slot:item.driverId="{ item }">
        {{ getNameDriver(item.driverId ?? 0) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" class="ma-1" color="primary" icon="mdi-pencil" @click="editUnit({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete" @click="confirmDeleteUnit({ item: item })"></v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="unitDialog" max-width="500">
    <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
      <v-card prepend-icon="mdi-account" title="Perfil de bus">
        <v-card-text>
          <TextFieldUppercase
            density="compact"
            label="Nombre*"
            variant="outlined"
            color="secondary"
            required
            :rules="[rules.required]"
            v-model.trim="unit.carPlate"
          ></TextFieldUppercase>
          <v-select
            density="compact"
            variant="outlined"
            color="secondary"
            v-model="unit.driverId"
            :items="formattedDrivers"
            item-title="fullName"
            item-value="id"
            label="Conductor*"
            :return-object="false"
            required
          >
          </v-select>
          <small class="text-caption text-medium-emphasis">* obligatorio</small>
        </v-card-text>
        <v-divider></v-divider>
        <div v-if="errors.apiError" class="mt-2">
          <v-alert color="error" variant="tonal">{{ errors.apiError }}</v-alert>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" variant="plain" @click="unitDialog = false"></v-btn>
          <v-btn color="primary" :loading="isSubmitting" class="mt-2" variant="tonal" :disabled="!isFormValid" type="submit"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </Form>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" top>
    <strong>{{ snackbarTitle }} </strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { UnitService } from '@/unit-management/services/unit-service';
import { DriverService } from '@/unit-management/services/driver-service';
import { Form } from 'vee-validate';
import TextFieldUppercase from '@/components/shared/TextFieldUppercase.vue';

const search = ref('');
const unitService = new UnitService();
const driverService = new DriverService();
const unitDialog = ref(false);
const unit = ref<Partial<UnitModel>>({});
const units = ref<UnitModel[]>([]);
const drivers = ref<DriverModel[]>([]);
const isFormValid = computed(() => {
  return (
    unit.value.carPlate &&
    unit.value.driverId
  );
});
const unitResource = ref<CreateUnitModel | null>(null);
//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');

onMounted(() => {
  getAllUnits();
  getAllDriver();
});
const rules = {
  required: (value: string) => !!value || 'Este campo es requerido.',
}
const formattedDrivers = computed(() => {
  return drivers.value.map((driver) => ({
    ...driver,
    fullName: `${driver.name} ${driver.lastName}` // Combina el nombre y apellido
  }));
});
function validate(values: any, { setErrors }: any) {
  unitResource.value = {
    carPlate: unit.value.carPlate,
    driverId: unit.value.driverId
  };
  if (unit.value.carPlate && unit.value.driverId) {
    if (unit.value.id) {
      return unitService
        .update(unit.value.id, unitResource.value)
        .then((response) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllUnits();
          unitDialog.value = false;
          unit.value = {};
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
      //new unit
      return unitService
        .create(unitResource.value)
        .then((response) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllUnits();
          unitDialog.value = false;
          unit.value = {};
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
  } else setErrors({ apiError: 'Error: faltan datos' });
}

function getNameDriver(driverId: number) {
  const driver = drivers.value.find((driver) => driver.id === driverId);
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
}

const openNew = () => {
  unit.value = {};
  unitDialog.value = true;
};

const editUnit = ({ item }: { item: any }) => {
  unit.value = { ...item };
  unitDialog.value = true;
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
  // aseguro de que id existirá en tiempo de ejecución
  const id = (unit.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  unitService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllUnits();
  });
  unit.value = { carPlate: '', driverId: 0 };
};

const headers = [
  { key: 'carPlate', title: 'NOMBRE' },
  { key: 'driverId', title: 'CONDUCTOR ASIGADO' },
  { key: 'actions', title: 'ACCIONES', sortable: false }
];
</script>

<style scoped lang="scss"></style>
