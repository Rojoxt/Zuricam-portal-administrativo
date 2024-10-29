<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalReport.vue';
import TotalOrder from './components/TotalUser.vue';
import TotalIncome from './components/TotalIncome.vue';
import WelcomeCard from '@/views/dashboards/default/components/WelcomeCard.vue';
</script>

<template>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Earning -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="12">
      <WelcomeCard />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Earning -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalEarning />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Order -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalOrder />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Income -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalIncome />
    </v-col>
  </v-row>
</template>
