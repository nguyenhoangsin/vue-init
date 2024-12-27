<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { authProvider } from '../services/authService';

type FormValues = {
  name: string;
  email: string;
};

const isLoggingIn = ref(false);
const router = useRouter();
const route = useRoute();
const from = route.query.from || '/';
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
});
const { values, errors, handleSubmit, setFieldValue } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
});

onMounted(() => {
  document.title = 'Login';
});

const onSubmit = handleSubmit(async (values: FormValues) => {
  console.log('values', values);
  isLoggingIn.value = true;
  try {
    await authProvider.signin(values.email);
    router.push(from as string);
  } catch (error) {
    console.error(error);
  } finally {
    isLoggingIn.value = false;
  }
});
</script>

<template>
  <p>You must log in to view the page at {{ from }}</p>
  <form @submit="onSubmit">
    <div>
      <label for="name">Name: </label>
      <input
        placeholder="Enter your name"
        :value="values.name"
        @input="
          setFieldValue('name', ($event.target as HTMLInputElement).value)
        "
      />
      <div v-if="errors.name" style="color: red">{{ errors.name }}</div>
    </div>

    <div>
      <label for="email">Email: </label>
      <input
        placeholder="Enter your email"
        :value="values.email"
        @blur="
          setFieldValue('email', ($event.target as HTMLInputElement).value)
        "
      />
      <div v-if="errors.email" style="color: red">{{ errors.email }}</div>
    </div>

    <button type="submit" :disabled="isLoggingIn">
      {{ isLoggingIn ? 'Logging in...' : 'Login' }}
    </button>
  </form>
  <p>{{ values }}</p>
  <p>{{ errors }}</p>
</template>

<style module lang="scss"></style>
