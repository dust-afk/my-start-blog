<template>
  <section class="not-found">
    <h1>404</h1>
    <p>你访问的页面不存在。</p>
    <RouterLink to="/blog">返回 Blog</RouterLink>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found h1 {
  margin: 0;
  font-size: 52px;
}

.not-found p {
  margin: 12px 0;
  color: var(--muted);
  font-size: 18px;
}

.not-found a {
  color: var(--link);
  font-size: 18px;
}
</style>
