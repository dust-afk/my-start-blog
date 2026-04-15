<template>
  <div class="app-shell">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #eef7ff;
  color: #333;
}

.app-shell {
  min-height: 100vh;
}

.dark body {
  background: #111827;
  color: #e5e7eb;
}
</style>
