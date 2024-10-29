<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary mb-6">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <TableIcon stroke-width="1.5" width="25" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ totalDriver }}</h4>
          <span class="text-subtitle-2 text-medium-emphasis text-white">Total de conductores</span>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
          <BuildingStoreIcon stroke-width="1.5" width="25" class="text-warning" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{ totalCamera }}</h4>
          <span class="text-subtitle-2 text-disabled font-weight-medium">Total de camaras</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DriverService } from '@/unit-management/services/driver-service';
import { CameraService } from '@/camera-management/services/camera-service';

const driverService = new DriverService();
const cameraService = new CameraService();

const totalDriver = ref<number>(0);
const totalCamera = ref<number>(0);

onMounted(() => {
  getAllData();
});

async function getAllData() {
  try {
    const response = await driverService.getAll();
    const response2 = await cameraService.getAll();

    // Asegúrate de que `data.result` exista en la respuesta
    totalDriver.value = response?.data?.result?.length ?? 0;
    totalCamera.value = response2?.data?.result?.length ?? 0;
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}
</script>
