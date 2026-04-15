<template>
  <main class="mx-auto max-w-4xl px-4 py-10 sm:px-8">
    <h1 class="text-3xl font-normal">页面未找到</h1>
    <p class="mt-2">404：你访问的页面不存在。</p>

    <nav class="mt-4 border-t border-blue-200 pt-4">
      <div class="flex flex-wrap gap-4">
        <RouterLink to="/">回首页</RouterLink>
        <RouterLink to="/blog">去 Blog</RouterLink>
        <RouterLink to="/resume">去 Resume</RouterLink>
      </div>
    </nav>
  </main>
</template>

<script setup lang="ts"></script>
