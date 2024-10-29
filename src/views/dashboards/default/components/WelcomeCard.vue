<script setup lang="ts">
import { ref } from 'vue';


const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>

<template>
  <v-container class="d-flex justify-center align-center welcome-container" fill-height>
    <v-card elevation="5" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape text-center">
      <h1 class="welcome-title" style="margin-top: 50px; margin-left: 50px; margin-right: 50px">Bienvenido al portal administrativo</h1>
      <h2 class="zuricam-title">Zuricam</h2>
      <v-row style="padding: 50px">
        <v-col cols="12" lg="6">
          <p class="welcome-subtitle" style="margin: 25px">
            Bienvenido al portal administrativo, donde podrás gestionar usuarios, crear reportes, agregar conductores y movilidades, todo en
            un entorno seguro con tecnología de detección de armas en tiempo real, diseñado específicamente para el sector de transporte
            público.
          </p>
          <div class="vintage-btn" color="white" rounded>Tu seguridad es lo mas importante</div>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape-sm bubble-primary">
            <v-card-text>
              <svg width="100%" height="320" viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 270 H 2500" id="zuricamPath" fill="transparent" />

                <!-- Cuerpo de la cámara -->
                <rect x="60" y="100" width="220" height="180" :fill="primary" />
                <rect x="70" y="110" width="180" height="140" fill="#FFF" />

                <!-- Lente de la cámara
                <circle cx="160" cy="180" r="60" :fill="primary" />

                <!-- Detalle de la lente -->
                <circle cx="160" cy="180" r="40" :fill="primary" />
                <circle cx="160" cy="180" r="20" :fill="secondary" />

                <!-- Botón de la cámara -->
                <circle cx="220" cy="140" r="20" :fill="secondary" />

                <!-- Parte superior de la cámara -->
                <rect x="140" y="80" width="40" height="20" :fill="primary" />
              </svg>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.welcome-container {
  border-radius: 15px;
  background: linear-gradient(180deg, #4b0082 0%, #a32cc4 100%);
  background-size: cover;
}

.v-card {
  text-align: center;
}

.welcome-title {
  font-family: 'Poppins', sans-serif;
  color: white;
  font-size: 64px; /* Aumentado el tamaño */
  font-weight: bold;
  margin-bottom: 10px;
}

.zuricam-title {
  font-family: 'Poppins', sans-serif;
  color: white;
  font-size: 80px; /* Aumentado el tamaño */
  font-weight: bold;
  margin-bottom: 30px;
}

.welcome-subtitle {
  font-size: 24px; /* Aumentado el tamaño */
  color: #e0e0e0;
  margin-bottom: 20px;
}

.vintage-btn {
  background-color: white;
  color: #4b0082;
  font-weight: bold;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 10px;
}
</style>
