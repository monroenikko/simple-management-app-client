<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { reactive, onMounted } from 'vue';

const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
onMounted(() => (errors.value = {}));

const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
});
</script>

<template>
  <main>
    <h1 class="title">Signup a new Account</h1>

    <form
      @submit.prevent="authenticate('signup', formData)"
      class="w-1/2 mx-auto space-y-6"
      action=""
    >
      <div>
        <input
          type="text"
          placeholder="First Name"
          v-model="formData.first_name"
        />
        <p v-if="errors.first_name" class="error">{{ errors.first_name[0] }}</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Last Name"
          v-model="formData.last_name"
        />
        <p v-if="errors.last_name" class="error">{{ errors.last_name[0] }}</p>
      </div>
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

      <button type="submit" class="primary-btn">Signup</button>
    </form>
  </main>
</template>
