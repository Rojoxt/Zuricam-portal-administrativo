<template>
  <v-text-field v-model="uppercaseValue" :label="label" outlined />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: String
});

const emit = defineEmits(['update:modelValue']);

// Computed para transformar el texto a mayúsculas
const uppercaseValue = computed({
  get: () => (props.modelValue ? String(props.modelValue).toUpperCase() : ''),
  set: (value) => emit('update:modelValue', String(value).toUpperCase())
});
</script>
