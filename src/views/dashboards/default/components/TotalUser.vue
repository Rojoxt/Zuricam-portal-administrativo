<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CircleArrowDownLeftIcon } from 'vue-tabler-icons';
import { UserService } from '@/user-management/services/user-service';
import iconCard from '@/assets/images/icons/icon-card.svg';
import { exportToExcel } from '@/core/utils/excelExporter';

const tab = ref('1');
const userService = new UserService();
const totalUser = ref(0);

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 90,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      min: 0,
      max: 100
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Total Usuarios'
        }
      },
      marker: {
        show: false
      }
    }
  };
});

// chart 1
const lineChart1 = {
  series: [
    {
      name: 'series1',
      data: [45, 66, 41, 89, 25, 44, 9, 54]
    }
  ]
};

onMounted(() => {
  getAllUsers();
});

async function getAllUsers() {
  const response = await userService.getAll();
  totalUser.value = response.data.result.length;
  console.log('Response data:', response.data.detail);
}
</script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-primary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darkprimary" variant="flat">
          <img :src="iconCard" width="25" />
        </v-btn>
        <div class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" end>
            <v-tab value="1" hide-slider color="transparent">Month</v-tab>
          </v-tabs>
        </div>
      </div>
      <v-window v-model="tab" class="z-1">
        <v-window-item value="1">
          <v-row>
            <v-col cols="6">
              <h2 class="text-h1 font-weight-medium">
                {{ totalUser }}
                <a>
                  <CircleArrowDownLeftIcon stroke-width="1.5" width="28" class="text-white" />
                </a>
              </h2>
              <span class="text-subtitle-1 text-medium-emphasis text-white">Total de Usuarios</span>
            </v-col>
            <v-col cols="6">
              <apexchart type="line" height="90" :options="chartOptions1" :series="lineChart1.series"> </apexchart>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
