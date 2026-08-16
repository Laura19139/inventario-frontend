<script setup lang="ts">
</script>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />

  <div class="container">
    <router-view />
  </div>
</template>

<style>
body {
  background-image: url("/images/background.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
}

.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}
</style>