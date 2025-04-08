<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  pagination: Object,
  currentPage: Number,
});

const emit = defineEmits(['page-changed']);

const goToPage = (page) => {
  console.log('Going to page:', page);
  emit('page-changed', page);
};

const getPageNumber = (url) => {
  const params = new URL(url).searchParams;
  return parseInt(params.get('page')) || 1;
};
</script>

<template>
  <div class="flex justify-center items-center gap-2 mt-4 flex-wrap">
    <button
      v-for="link in pagination.links"
      :key="link.label"
      v-html="link.label"
      :disabled="!link.url"
      @click="goToPage(getPageNumber(link.url))"
      class="px-3 py-1 text-sm rounded"
      :class="{
        'bg-blue-500 text-white': link.active,
        'bg-gray-200 hover:bg-gray-300': !link.active,
      }"
    ></button>
  </div>
</template>
