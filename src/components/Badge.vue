<script setup>
import { defineProps } from 'vue';
defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
  },
});
</script>

<template>
  <span
    class="inline-block text font-semibold mr-2 px-2.5 py-0.5 rounded text-white"
    :class="`bg-${color}-500 dark:bg-${color}-200 dark:text-${color}-900`"
  >
    {{ label }}
  </span>
</template>
