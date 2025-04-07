<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';

const route = useRoute();
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <nav>
        <RouterLink :to="{ name: 'home' }" class="nav-link"
          >TECH EXAM</RouterLink
        >

        <div v-if="authStore.user" class="flex items-center space-x-6">
          <p v-if="authStore.user" class="text-sm text-slate-300">
            {{ authStore.user }}
          </p>

          <form @submit.prevent="authStore.logout">
            <button class="nav-link">Logout</button>
          </form>
        </div>

        <div v-if="!authStore.user">
          <RouterLink :to="{ name: 'signup' }" class="nav-link">
            Signup
          </RouterLink>
          <RouterLink :to="{ name: 'login' }" class="nav-link">
            Login
          </RouterLink>
        </div>
      </nav>
    </header>

    <div class="flex-1 bg-gray-200 p-4 overflow-auto">
      <main class="text-end" v-if="authStore.user">
        <RouterLink
          v-if="route.name !== 'create' && route.name !== 'update'"
          :to="{ name: 'create' }"
          class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
        >
          New Post
        </RouterLink>
      </main>
      <RouterView />
    </div>
  </div>
</template>
