<script setup>
import { ref, defineProps, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  label: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const selectedOption = ref(null);
const selectRef = ref(null);

const displayValue = computed(() => {
  const option = props.options.find((opt) => opt.value === props.modelValue);
  return option ? option.label : props.placeholder;
});

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  emit('update:modelValue', option.value);
  emit('change', option);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = props.options.find((opt) => opt.value === newValue);
  }
);
</script>

<template>
  <div class="relative" ref="selectRef">
    <div
      @click="toggleDropdown"
      class="flex justify-between items-center px-3 py-1 border rounded-md shadow-sm cursor-pointer"
      :class="[
        disabled
          ? 'bg-gray-100 cursor-not-allowed'
          : 'bg-white hover:border-blue-500',
        error
          ? 'border-red-300 focus:ring-red-500'
          : 'border-gray-300 focus:ring-blue-500',
        isOpen ? 'ring-2 ring-blue-500 border-blue-500' : '',
      ]"
    >
      <span :class="props.modelValue ? 'text-gray-900' : 'text-gray-500'">{{
        displayValue
      }}</span>
      <svg
        class="h-5 w-5 text-gray-400"
        :class="isOpen ? 'transform rotate-180' : ''"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-300"
    >
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-1 cursor-pointer hover:bg-blue-50"
        :class="option.value === modelValue ? 'bg-blue-100 font-medium' : ''"
      >
        {{ option.label }}
      </div>
      <div v-if="options.length === 0" class="px-3 py-2 text-gray-500">
        No options available
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
