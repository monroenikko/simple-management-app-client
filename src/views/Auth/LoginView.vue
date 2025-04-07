<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { onMounted, reactive } from 'vue';

const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
onMounted(() => (errors.value = {}));

const formData = reactive({
  email: '',
  password: '',
});
</script>

<template>
  <main>
    <h1 class="title">Login</h1>

    <div
      v-if="errors.code == 401 || errors.code == 500"
      class="max-w-md mx-auto mt-5"
    >
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p class="font-bold">Error!</p>
        <p>{{ errors.message }}</p>
      </div>
    </div>

    <form
      @submit.prevent="authenticate('login', formData)"
      class="w-1/2 mx-auto space-y-6"
      action=""
    >
      <div>
        <input type="email" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="formData.password"
        />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>

      <button type="submit" class="primary-btn">Login</button>
    </form>
  </main>
</template>
