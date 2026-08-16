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
  min-height: 100vh;
  margin: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url("/images/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #0f172a;
}

.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}
</style>