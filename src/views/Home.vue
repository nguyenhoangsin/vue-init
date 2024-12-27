<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authProvider } from '../services/authService';
import loadingService from '../services/loadingService';

const isLoggingOut = ref(false);
const username = ref(authProvider.username);
const router = useRouter();

const onLogoutClick = async () => {
  isLoggingOut.value = true;
  await authProvider.signout();
  router.push('/login');
  isLoggingOut.value = false;
};

const showLoading = () => {
  loadingService.showLoading();
  setTimeout(() => {
    loadingService.hideLoading();
  }, 2000);
};
</script>

<template>
  <div>
    <h1>Home Page - USER: {{ username }}</h1>
    <router-link to="/login">Go to login</router-link>
    <button :disabled="isLoggingOut" @click="onLogoutClick">
      {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
    </button>
    <div>
      <button @click="showLoading">Show Loading</button>
    </div>
  </div>
</template>

<style module lang="scss"></style>
