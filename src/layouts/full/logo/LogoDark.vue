<template>
  <div class="logo">
    <RouterLink to="/">
      <svg width="110" height="32" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 27 H 250" id="zuricamPath" fill="transparent" />
        <text font-family="Roboto" font-size="16" font-weight="bold" fill="black">
          <textPath href="#zuricamPath">ZURICAM</textPath>
        </text>
        <!-- Cuerpo de la cámara -->
        <rect x="6" y="10" width="22" height="18" :fill="secondary" />
        <rect x="7" y="11" width="18" height="14" fill="#FFF" />
        <!-- Lente de la cámara -->
        <circle cx="16" cy="18" r="6" :fill="primary" />

        <!-- Detalle de la lente -->
        <circle cx="16" cy="18" r="4" :fill="primary" />
        <circle cx="16" cy="18" r="2" :fill="secondary" />

        <!-- Botón de la cámara -->
        <circle cx="22" cy="14" r="2" :fill="secondary" />

        <!-- Parte superior de la cámara -->
        <rect x="14" y="8" width="4" height="2" :fill="secondary" />
      </svg>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const primary = ref("rgb(var(--v-theme-primary))");
const secondary = ref("rgb(var(--v-theme-secondary))");
</script>
