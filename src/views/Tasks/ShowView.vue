<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Badge from '@/components/Badge.vue';

const route = useRoute();
const { getTask, deleteTask } = useTasksStore();
const authStore = useAuthStore();
const task = ref(null);

const BASE_URL = ref(import.meta.env.VITE_BASE_URL);

onMounted(async () => (task.value = await getTask(route.params.id)));
</script>

<template>
  <main>
    <div v-if="task">
      <div class="row flex flex-wrap">
        <div class="w-full h-full pt-10">
          <div class="bg-white shadow-md rounded-xl overflow-hidden">
            <div class="p-4">
              <Badge :label="task.status.name" :color="task.status.color" />
              <h2 class="text-xl font-semibold mb-2 mt-2">
                TITLE: {{ task.title }}
              </h2>
              <p class="text-gray-600 text-sm">Content: {{ task.content }}</p>
            </div>

            <div class="p-4" v-if="task.images.length > 0">
              <h3 class="text-xl font-semibold mb-2">Images</h3>
              <div class="flex flex-wrap gap-4 p-4">
                <img
                  v-for="(image, index) in task.images"
                  :key="index"
                  :src="BASE_URL + image.path"
                  class="w-1/3 h-32 object-cover rounded-lg"
                  alt="Task image"
                />
              </div>
            </div>
          </div>
          <div
            class="flex items-center gap-6 mt-6"
            v-if="authStore.user && authStore.user.id === task.user_id"
          >
            <form @submit.prevent="deleteTask(task)">
              <button
                class="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </form>
            <RouterLink
              :to="{ name: 'update', params: { id: task.id } }"
              class="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              >Edit
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <h2 class="title">Page not found!</h2>
    </div>
  </main>
</template>
