<template>
  <div
    v-if="isVisible"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-xs w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg"
    :class="{
      'bg-red-500': type === 'error',
      'bg-green-500': type === 'success',
      'bg-yellow-500': type === 'warning',
      'bg-blue-500': type === 'info',
    }"
  >
    <div class="flex items-center">
      <span class="mr-2">{{ icon }}</span>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(['close']);

const isVisible = ref(true);
const icon = computed(() => {
  switch (props.type) {
    case 'error':
      return '❌';
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '';
  }
});

setTimeout(() => {
  isVisible.value = false;
  emit('close');
}, props.duration);
</script>
