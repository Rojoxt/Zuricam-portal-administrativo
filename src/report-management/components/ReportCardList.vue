<template>
  <v-card flat class="pa-md-10">
    <v-card flat class="rounded-sm border-md">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn type="success" color="success" prepend-icon="mdi-plus" class="ma-1" @click="openNew">Añadir </v-btn>
          </v-col>
          <v-col cols="auto"> </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn type="success" color="secondary" prepend-icon="mdi-tray-arrow-up" class="ma-1">Import </v-btn>
            <v-btn type="success" color="secondary200" prepend-icon="mdi-tray-arrow-up" class="ma-1" @click="exportCSV">Export </v-btn>
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

    <v-divider></v-divider>
    <v-data-table v-model:search="search" :headers="headers" :items="reports" items-per-page="5">
      <template v-slot:item.unitId="{ item }">
        {{ getCarPlateUnit(item.unitId ?? 0) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" class="ma-1" color="primary" icon="mdi-pencil" @click="editReport({ item: item })"></v-btn>
        <v-btn size="small" class="ma-1" color="error" icon="mdi-delete" @click="confirmDeleteReport({ item: item })"></v-btn>
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

  <v-dialog v-model="deleteReportDialog" max-width="400">
    <v-card prepend-icon="mdi-delete" title="Confirmacion">
      "Are you sure you want to delete Report"
      <v-divider></v-divider>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn text="Cancelar" variant="plain" @click="deleteReportDialog = false"></v-btn>
          <v-btn color="secondary" text="Confirmar" variant="tonal" @click="deleteReport"></v-btn>
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
import { onMounted, ref } from 'vue';
import { exportToExcel } from '@/core/utils/excelExporter';
import { CameraService } from '@/camera-management/services/camera-service';
import { UnitService } from '@/unit-management/services/unit-service';
import { ReportService } from '@/report-management/services/report-service';

const search = ref('');
const reportService = new ReportService();
const unitService = new UnitService();
const reportDialog = ref(false);
const deleteReportDialog = ref(false);
const report = ref<CreateReportModel>({});
const reports = ref<ReportModel[]>([]);
const units = ref<UnitModel[]>([]);

//configuration snackbars
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const snackbarTitle = ref('');

onMounted(() => {
  getAllReports();
  getAllUnits();
});

const exportCSV = () => {
  exportToExcel(reports.value);
};
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

const openNew = () => {
  report.value = {};
  reportDialog.value = true;
};

const editReport = ({ item }: { item: any }) => {
  report.value = { ...item };
  reportDialog.value = true;
};
function getCarPlateUnit(unitId: number) {
  const unit = units.value.find((unit) => unit.id === unitId);
  return unit ? `${unit.carPlate} ` : 'Unit not found';
}
const saveReport = ({ report }: { report: any }) => {
  const reportResource: CreateReportModel = {
    address: report.address,
    incident: report.incident,
    trackingLink: report.trackingLink,
    image: report.image,
    unitId: report.unitId
  };

  if (report.address && report.image && report.incident && report.unitId) {
    if (report.id) {
      reportService.update(report.id, reportResource).then((response) => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllReports();
      });
    } else {
      //new report
      reportService.create(report).then((response) => {
        addToast('Success', `${response.data.detail}`, 'success');
        getAllReports();
      });
    }
    console.log('valrodereport', report);
    reportDialog.value = false;
    report.value = {};
  } else addToast('Error', 'Faltan datos', 'error');
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

const confirmDeleteReport = ({ item }: { item: any }) => {
  report.value = { ...item };
  deleteReportDialog.value = true;
};

const deleteReport = () => {
  // aseguro de que id existirá en tiempo de ejecución
  const id = (report.value as any).id;

  //drivers.value = drivers.value.filter((val) => val.id !== id);
  reportService.delete(id).then((response) => {
    addToast('Success', `${response.data.detail}`, 'success');
    getAllReports();
  });
  report.value = {};
  deleteReportDialog.value = false;
};

const headers = [
  { key: 'address', title: 'Dirección' },
  { key: 'incident', title: 'Lugar' },
  { key: 'trackingLink', title: 'Enlace' },
  { key: 'image', title: 'Imagen' },
  { key: 'unitId', title: 'Unidad' },
  { key: 'createdAt', title: 'createdAt' },
  { key: 'updatedAt', title: 'updatedAt' },
  { key: 'actions', title: 'Acciones', sortable: false }
];
</script>

<style scoped lang="scss"></style>
