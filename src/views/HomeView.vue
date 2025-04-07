<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { useStatusStore } from '@/stores/statusesStore';
import { onMounted, computed, watchEffect, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import Pagination from '@/components/Pagination.vue';
import SelectComponent from '@/components/Select.vue';
import Badge from '@/components/Badge.vue';
import AlertNotification from '@/components/AlertNotif.vue';

const statusStore = useStatusStore();
const { errors } = storeToRefs(useTasksStore());
const taskStore = useTasksStore();
onMounted(() => (errors.value = {}));

const statusId = ref('');
const perPage = ref('');
const keyword = ref('');
const ordering = ref('desc');
const field = ref('title');
const perPages = ref([]);

const fields = ref([
  {
    label: 'Title',
    value: 'title',
  },
  {
    label: 'Created At',
    value: 'created_at',
  },
]);

const orders = ref([
  {
    label: 'Ascending',
    value: 'ASC',
  },
  {
    label: 'Descending',
    value: 'DESC',
  },
]);

const statusOptions = computed(() => {
  if (!statusStore.statuses) return [];

  return statusStore.statuses.map((status) => ({
    value: status.id,
    label: status.name,
  }));
});

const handleSearch = () => {
  taskStore.getAllTasks(taskStore.currentPage, {
    keyword: keyword.value,
    status_id: statusId.value,
    per_page: perPage.value,
    field: field.value,
    ordering: ordering.value,
  });
};

const handleReset = () => {
  keyword.value = '';
  statusId.value = '';
  perPage.value = '';
  field.value = '';
  ordering.value = '';
  taskStore.getAllTasks();
};

const handleMarkStatus = async (data) => {
  let formData = {
    id: data.id,
    status_id: data.status_id,
  };
  await taskStore.markTaskStatus(data, formData);
};

const generatePageOptions = () => {
  perPages.value = Array.from(
    { length: taskStore.pagination.total },
    (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    })
  );
};

watchEffect(() => {
  if (taskStore.pagination.total > 0) {
    generatePageOptions();
  }
});

onMounted(async () => {
  taskStore.getAllTasks();
  await statusStore.getAllStatuses();
});
</script>

<template>
  <main>
    <h1 class="title">Manage Tasks</h1>

    <AlertNotification
      v-if="taskStore.notificationVisible"
      :message="taskStore.notificationMessage"
      :type="taskStore.notificationType"
      :duration="5000"
      @close="taskStore.notificationVisible = false"
    />

    <div class="w-full p-2">
      <div class="flex flex-wrap gap-4">
        <div
          class="w-full sm:w-auto sm:min-w-40 sm:flex-grow-0 sm:flex-shrink-0"
        >
          <SelectComponent
            v-model="perPage"
            :options="perPages"
            placeholder="Per Page"
            @change="handleSearch"
            :error="errors.perPage ? errors.perPage[0] : ''"
          />
        </div>

        <div
          class="w-full sm:w-auto sm:min-w-40 sm:flex-grow-0 sm:flex-shrink-0"
        >
          <SelectComponent
            v-model="statusId"
            :options="statusOptions"
            placeholder="Select Status"
            @change="handleSearch"
            :error="errors.status_id ? errors.status_id[0] : ''"
          />
        </div>

        <div class="w-full sm:flex-1">
          <input
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            placeholder="Search"
            v-model="keyword"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="w-full p-2">
      <div class="flex flex-wrap gap-4">
        <div
          class="w-full sm:w-auto sm:min-w-40 sm:flex-grow-0 sm:flex-shrink-0"
        >
          <SelectComponent
            v-model="field"
            :options="fields"
            placeholder="Select Field"
            @change="handleSearch"
            :error="errors.status_id ? errors.status_id[0] : ''"
          />
        </div>

        <div
          class="w-full sm:w-auto sm:min-w-40 sm:flex-grow-0 sm:flex-shrink-0"
        >
          <SelectComponent
            v-model="ordering"
            :options="orders"
            placeholder="Select Order"
            @change="handleSearch"
            :error="errors.status_id ? errors.status_id[0] : ''"
          />
        </div>

        <div class="w-full sm:flex-1">
          <button
            class="px-4 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            @click="handleReset"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
    <div v-if="taskStore.tasks.length > 0" class="row flex flex-wrap">
      <div
        class="w-full md:w-1/3 p-2"
        v-for="data in taskStore.tasks"
        :key="data.id"
      >
        <div class="bg-white shadow-md rounded-xl overflow-hidden">
          <div class="p-4">
            <div class="text-end">
              <Badge :label="data.status.name" />
            </div>

            <div class="py-3">
              <SelectComponent
                v-model="data.status_id"
                :options="statusOptions"
                @change="handleMarkStatus(data)"
                placeholder="Select Status"
                :error="errors.status_id ? errors.status_id[0] : ''"
              />
            </div>
            <h2 class="text-xl font-semibold mb-2 mt-2">{{ data.title }}</h2>
            <p class="text-gray-600 text-sm">
              {{ data.content }}
            </p>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-100">
            <RouterLink
              :to="{ name: 'show', params: { id: data.id } }"
              class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              >View
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">There are no tasks</h2>
    </div>
    <div class="mt-6" v-if="taskStore.tasks.length > 0">
      <Pagination
        :pagination="taskStore.pagination"
        :current-page="taskStore.currentPage"
        @page-changed="taskStore.getAllTasks"
      />
    </div>
  </main>
</template>
