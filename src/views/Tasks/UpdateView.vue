<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useStatusStore } from '@/stores/statusesStore';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Switch } from '@headlessui/vue';
import UploadComponent from '@/components/Upload.vue';
import SelectComponent from '@/components/Select.vue';

const router = useRouter();
const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(useTasksStore());
const { getTask, updateTask } = useTasksStore();
const statusStore = useStatusStore();
onMounted(() => (errors.value = {}));

const task = ref(null);

const formData = reactive({
  title: '',
  content: '',
  status_id: '',
  enabled: false,
  images: [],
});

const statusOptions = computed(() => {
  if (!statusStore.statuses) return [];

  return statusStore.statuses.map((status) => ({
    value: status.id,
    label: status.name,
  }));
});

onMounted(async () => {
  task.value = await getTask(route.params.id);
  await statusStore.getAllStatuses();

  if (user.value.id !== task.value.user_id) {
    router.push({ name: 'home' });
  } else {
    formData.title = task.value.title;
    formData.content = task.value.content;
    formData.status_id = task.value.status_id;
    formData.is_draft = task.value.is_draft;
    formData.is_published = task.value.is_published;
    formData.images = task.value.images.map((image) => ({
      url: image.path,
    }));
  }
});
</script>

<template>
  <main>
    <div class="bg-white shadow-md rounded-xl pt-1 pb-14">
      <h1 class="title">Update your Task</h1>

      <form
        @submit.prevent="updateTask(task, formData)"
        class="w-1/2 mx-auto space-y-6"
      >
        <div>
          <SelectComponent
            v-model="formData.status_id"
            :options="statusOptions"
            placeholder="Select Status"
            :error="errors.status_id ? errors.status_id[0] : ''"
          />
        </div>

        <div>
          <input type="text" placeholder="Title" v-model="formData.title" />
          <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
        </div>

        <div>
          <textarea
            rows="6"
            placeholder="Content"
            v-model="formData.content"
          ></textarea>
          <p v-if="errors.content" class="error">{{ errors.content[0] }}</p>
        </div>

        <Switch
          v-model="formData.enabled"
          :class="formData.enabled ? 'bg-blue-600' : 'bg-gray-200'"
          class="relative inline-flex h-6 w-11 items-center rounded-full"
        >
          <span class="sr-only">Toggle publish</span>
          <span
            :class="formData.enabled ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          />
        </Switch>

        <span class="text-sm font-medium text-gray-700 ml-4">
          {{ formData.enabled ? 'Publish' : 'Draft' }}
        </span>

        <UploadComponent v-model="formData.images" :action="'update'" />

        <button class="primary-btn">Update</button>
      </form>
    </div>
  </main>
</template>
