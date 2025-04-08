<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  action: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const files = ref([...props.modelValue]);

const API_URL = ref(import.meta.env.VITE_BASE_URL);

const triggerChange = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    files.value = [...newValue];
  },
  { immediate: true }
);

const fileInput = ref(null);

const handleFileChange = (event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles) {
    triggerChange.value = true;
    Array.from(selectedFiles).forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      files.value.push({ file, url: fileUrl });
    });

    emit('update:modelValue', [...files.value]);
  }
};

const handleDrop = (event) => {
  const droppedFiles = event.dataTransfer.files;
  if (droppedFiles) {
    Array.from(droppedFiles).forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      files.value.push({ file, url: fileUrl });
    });
    emit('update:modelValue', [...files.value]);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  emit('update:modelValue', [...files.value]);
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
</script>

<template>
  <div
    class="border-2 border-dashed border-gray-400 p-4 rounded-lg flex flex-col items-center justify-center space-y-4 cursor-pointer"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="handleFileChange"
    />
    <p class="text-gray-500">Drag & Drop your images here or click to select</p>

    <div
      v-if="files.length > 0"
      class="w-full grid grid-cols-3 gap-2 mt-4 mb-4"
    >
      <div v-for="(file, index) in files" :key="index" class="relative">
        <img
          :src="
            action === 'create'
              ? file.url
              : triggerChange === true
              ? file.url
              : API_URL + file.url
          "
          alt="Uploaded Image"
          class="w-full h-32 object-cover rounded-md"
        />
        <button
          @click="removeFile(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>
