<template>
  <v-card flat class="pa-md-10">
    <v-card flat class="rounded-sm border-md">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto"></v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn type="success" color="secondary" prepend-icon="mdi-tray-arrow-up" class="ma-1" @click="exportCSV">Export </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card-title class="d-flex align-center me-2">
      <v-icon icon="mdi-file-document-alert" color="secondary"></v-icon> &nbsp; Gestión de Reporte

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
    <!-- Diálogo para mostrar la imagen en grande -->
    <v-dialog v-model="imageDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Vista de imagen</v-card-title>
        <v-card-text>
          <img :src="currentImage" alt="Imagen ampliada" style="width: 100%" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" @click="imageDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-divider></v-divider>
    <v-data-table v-model:search="search" :headers="headers" :items="reports" items-per-page="5">
      <template v-slot:item.unitId="{ item }">
        {{ getCarPlateUnit(item.unitId ?? 0) }}
      </template>
      <template v-slot:item.image="{ item }">
        <img
          :src="'data:image/jpeg;base64,' + item.image"
          alt="Imagen del reporte"
          style="max-width: 100px; cursor: pointer"
          v-if="item.image"
          @click="openImageDialog(item.image)"
        />
        <p v-else>Cargando imagen...</p>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="reportDialog" max-width="500">
    <v-card prepend-icon="mdi-account" title="Perfil de camara">
      <v-card-text>
        <v-text-field
          density="compact"
          label="Dirección*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="report.address"
        ></v-text-field>
        <v-text-field
          density="compact"
          v-model.trim="report.incident"
          label="Lugar*"
          variant="outlined"
          color="secondary"
          required
        ></v-text-field>
        <v-text-field
          density="compact"
          label="Enlace*"
          variant="outlined"
          color="secondary"
          required
          v-model.trim="report.trackingLink"
        ></v-text-field>
        <v-text-field
          density="compact"
          v-model.trim="report.image"
          label="Imagen*"
          variant="outlined"
          color="secondary"
          required
        ></v-text-field>
        <v-combobox
          density="compact"
          variant="outlined"
          color="secondary"
          v-model="report.unitId"
          :items="units"
          item-title="carPlate"
          item-value="id"
          label="Bus"
          :return-object="false"
          required
        >
        </v-combobox>
        <small class="text-caption text-medium-emphasis">*indicates required field</small>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="reportDialog = false"></v-btn>
        <v-btn color="primary" text="Save" variant="tonal" @click="saveReport({ report: report })"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" top>
    <strong>{{ snackbarTitle }}</strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { exportToExcel } from '@/core/utils/excelExporter';
import { UnitService } from '@/unit-management/services/unit-service';
import { ReportService } from '@/report-management/services/report-service';

const search = ref('');
const reportService = new ReportService();
const unitService = new UnitService();
const reportDialog = ref(false);
const report = ref<CreateReportModel>({});
const reports = ref<ReportModel[]>([]);
const units = ref<UnitModel[]>([]);

//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');
const imageDialog = ref(false);
const currentImage = ref(''); // URL de la imagen actual

onMounted(() => {
  getAllReports();
  getAllUnits();
});

const exportCSV = () => {
  // Crear una copia de los datos, excluyendo el contenido de `image`
  const reportsToExport = reports.value.map(({ image, ...rest }) => ({
    ...rest,
    image: 'Imagen' // O deja vacío "" si prefieres no mostrar nada
  }));

  // Llamar a exportToExcel con los datos modificados
  exportToExcel(reportsToExport);
};
function openImageDialog(image: string) {
  // Asigna la imagen actual y abre el diálogo
  currentImage.value = `data:image/jpeg;base64,${image}`;
  imageDialog.value = true;
}
async function getAllUnits() {
  const response = await unitService.getAll();
  units.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

async function getAllReports() {
  const response = await reportService.getAll();
  reports.value = response.data.result;
  console.log('Response data:', response.data.detail);
}

function getCarPlateUnit(unitId: number) {
  const unit = units.value.find((unit) => unit.id === unitId);
  return unit ? `${unit.carPlate} ` : 'Unit not found';
}

const headers = [
  { key: 'address', title: 'Dirección' },
  { key: 'incident', title: 'Incidencia' },
  { key: 'trackingLink', title: 'Enlace' },
  { key: 'image', title: 'Imagen' },
  { key: 'unitId', title: 'Unidad' },
  { key: 'createdAt', title: 'createdAt' }
];
</script>

<style scoped lang="scss"></style>
