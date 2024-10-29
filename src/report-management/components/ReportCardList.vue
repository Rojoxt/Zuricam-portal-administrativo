<template>
  <v-card flat class="pa-md-10">
    <v-card flat class="rounded-sm border-md">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto"></v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn type="success" color="secondary" prepend-icon="mdi-tray-arrow-up" class="ma-1" @click="exportToExcel">EXPORTAR REPORTE</v-btn>
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
    <v-card-title class="d-flex align-center me-2">
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn type="success" color="primary" prepend-icon="mdi-calendar" class="ma-1" @click="dataFilterWithDates">Filtrar </v-btn>
      </v-col>
      <v-text-field
        v-model="startDate"
        type="date"
        label="Fecha de inicio"
        class="ma-1"
        style="max-width: 150px"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="endDate"
        type="date"
        label="Fecha de fin"
        class="ma-1"
        style="max-width: 150px"
        variant="outlined"
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
      <template v-slot:item.image="{ item }">
        <img
          :src="'data:image/jpeg;base64,' + item.image"
          alt="Imagen del reporte"
          style="max-width: 100px; cursor: pointer"
          v-if="item.image"
          @click="openImageDialog(item.image)"
        />
        <p v-else>Cargando imagen...</p></template
      >
      <template v-slot:item.unitId="{ item }">
        {{ getCarPlateUnit(item.unitId ?? 0) }}
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ formatDate(item.createdAt ?? 'fecha') }}
      </template>
    </v-data-table>
  </v-card>
  <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" top>
    <strong>{{ snackbarTitle }}</strong>
    <p>{{ snackbarMessage }}</p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import ExcelJS from 'exceljs';
import { UnitService } from '@/unit-management/services/unit-service';
import { ReportService } from '@/report-management/services/report-service';

const startDate = ref('');
const endDate = ref('');
const search = ref('');
const reportService = new ReportService();
const unitService = new UnitService();
const reports = ref<ReportModel[]>([]);
const units = ref<UnitModel[]>([]);
const allReports = ref<ReportModel[]>([]);
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
const showSnackbarError = (message: string) => {
  snackbarMessage.value = message;
  snackbarColor.value = 'error';
  snackbarTitle.value = 'Error';
  snackbar.value = true;
};
const dataFilterWithDates = () => {
  const [start, end, today] = [new Date(startDate.value), new Date(endDate.value), new Date()];

  if (!startDate.value || !endDate.value) {
    showSnackbarError('Por favor, selecciona ambas fechas.');
  } else if (end < start) {
    showSnackbarError('La fecha de fin no puede ser anterior a la fecha de inicio.');
  } else if (start > today || end > today) {
    showSnackbarError('Las fechas no pueden ser mayores a la fecha actual.');
  } else {
    reports.value = allReports.value.filter((report) => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= start && reportDate <= end;
    });
    // Reinicia los campos de fecha después de filtrar
    startDate.value = '';
    endDate.value = '';
  }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Opciones para el formato deseado
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', // Cambia a 'short' para abreviar el mes
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  // Formato la fecha
  return date.toLocaleDateString('es-ES', options);
}

// Función para exportar a Excel
const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  const headerStyle = {
    font: {
      color: { argb: 'FF000000' }, // Color blanco
      bold: true // Negrita
    }
  };
  // Añade encabezados
  const headerRow = worksheet.addRow(headers.map((header) => header.title));
  headerRow.eachCell((cell) => {
    cell.style.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.font = headerStyle.font;
  });

  // Define el ancho de las columnas
  worksheet.columns = [
    { header: headers[0].title, width: 30 }, // DIRECCIÓN
    { header: headers[1].title, width: 20 }, // INCIDENCIA
    { header: headers[2].title, width: 30 }, // ENLACE
    { header: headers[3].title, width: 15 }, // IMAGEN
    { header: headers[4].title, width: 20 }, // UNIDAD
    { header: headers[5].title, width: 40 } // Fecha DE CREACIÓN
  ];

  for (const item of reports.value) {
    const row = [
      item.address,
      item.incident,
      item.trackingLink,
      '',
      getCarPlateUnit(item.unitId ?? 1),
      formatDate(item.createdAt) // Formato de fecha
    ];

    // Añade la fila a la hoja
    const newRow = worksheet.addRow(row);
    // Establece el estilo de la fila
    newRow.eachCell((cell) => {
      cell.style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Añade la imagen si existe
    if (item.image) {
      const imageId = workbook.addImage({
        base64: 'data:image/jpeg;base64,' + item.image,
        extension: 'jpeg' // Cambia según el tipo de imagen
      });
      // Establece el tamaño de la imagen
      const imageHeight = 100; // Ajusta el alto de la imagen
      const imageWidth = 100; // Ajusta el ancho de la imagen

      // Establece el alto de la fila igual al alto de la imagen
      worksheet.getRow(newRow.number).height = 80;
      // Establece la celda donde se insertará la imagen
      worksheet.addImage(imageId, {
        tl: { col: 3, row: newRow.number - 1 }, // Cambia la posición de la imagen según sea necesario
        ext: { width: imageWidth, height: imageHeight } // Establece el tamaño de la imagen
      });
    }
  }

  // Exporta el archivo Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  });
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
  allReports.value = [...reports.value];
  console.log('Response data:', response.data.detail);
}

function getCarPlateUnit(unitId: number) {
  const unit = units.value.find((unit) => unit.id === unitId);
  return unit ? `${unit.carPlate} ` : 'Unit not found';
}

const headers = [
  { key: 'address', title: 'DIRECCIÓN' },
  { key: 'incident', title: 'INCIDENCIA' },
  { key: 'trackingLink', title: 'ENLACE' },
  { key: 'image', title: 'IMAGEN' },
  { key: 'unitId', title: 'UNIDAD' },
  { key: 'createdAt', title: 'FECHA DE CREACIÓN ' }
];
</script>

<style scoped lang="scss"></style>
