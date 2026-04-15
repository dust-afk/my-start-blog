<template>
  <main class="home-page">
    <header class="home-header">
      <div class="header-inner">
        <h1 class="site-title">我的网络日志</h1>

        <div class="header-actions">
          <button type="button" class="theme-toggle" @click="toggleTheme">
            {{ isDark ? '切换亮色' : '切换暗色' }}
          </button>
          <input type="text" class="search-input" placeholder="搜索" />
        </div>
      </div>
    </header>

    <div class="home-layout">
      <section class="home-main">
        <article v-if="featuredPost" class="post-card">
          <h2 class="post-title">
            <RouterLink :to="`/blog/${featuredPost.slug}`">{{ featuredPost.title }}</RouterLink>
          </h2>

          <p class="post-excerpt">{{ featuredPost.excerpt }}</p>

          <p>
            <RouterLink :to="`/blog/${featuredPost.slug}`" class="read-more">继续阅读全文 »</RouterLink>
          </p>

          <p class="post-meta">{{ featuredPost.date }}</p>
        </article>

        <section class="latest-list-block">
          <h3 class="section-title">最新文章</h3>
          <ul class="latest-list">
            <li v-for="post in recentPosts" :key="post.slug">
              <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
              <span class="list-date">（{{ post.date }}）</span>
            </li>
          </ul>
        </section>
      </section>

      <aside class="home-sidebar">
        <section class="sidebar-module">
          <h4 class="module-title">关于我</h4>
          <p>{{ profile.name }}</p>
          <p>{{ profile.tagline }}</p>
          <p>
            <a :href="profile.github" target="_blank" rel="noreferrer">GitHub</a>
            <span class="divider">|</span>
            <a :href="profile.twitter" target="_blank" rel="noreferrer">Twitter</a>
          </p>
        </section>

        <section class="sidebar-module">
          <h4 class="module-title">导航</h4>
          <ul class="sidebar-list">
            <li v-for="item in navItems" :key="item.to">
              <RouterLink :to="item.to">{{ item.label }}</RouterLink>
            </li>
          </ul>
        </section>

        <section class="sidebar-module">
          <h4 class="module-title">最新文章</h4>
          <ul class="sidebar-list">
            <li v-for="post in recentPosts" :key="`side-${post.slug}`">
              <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadAllPosts, type PostMeta } from '@/utils/markdown'

type NavItem = {
  label: string
  to: string
}

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-preference'

const navItems: NavItem[] = [
  { label: '首页', to: '/' },
  { label: '博客', to: '/blog' },
  { label: '简历', to: '/resume' }
]

const posts = ref<PostMeta[]>([])
const theme = ref<ThemeMode>('light')

const isDark = computed(() => theme.value === 'dark')
const featuredPost = computed(() => posts.value[0])
const recentPosts = computed(() => posts.value.slice(1, 8))

const profile = {
  name: '刘 嫒',
  tagline: '记录技术、工程实践与日常思考。',
  github: 'https://github.com',
  twitter: 'https://twitter.com'
}

const applyTheme = (nextTheme: ThemeMode, persist = true): void => {
  theme.value = nextTheme
  document.documentElement.className = nextTheme === 'dark' ? 'dark' : ''

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }
}

const toggleTheme = (): void => {
  applyTheme(isDark.value ? 'light' : 'dark')
}

onMounted(async () => {
  posts.value = await loadAllPosts()

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme, false)
    return
  }

  const initialTheme: ThemeMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  applyTheme(initialTheme, false)
})
</script>

<style scoped>
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 16px 48px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.home-header {
  margin-bottom: 24px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.site-title {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-toggle,
.search-input {
  height: 36px;
  border: 1px solid #cfd8e3;
  background: #fff;
  color: #333;
  font-size: 14px;
}

.theme-toggle {
  padding: 0 12px;
  border-radius: 8px;
  cursor: pointer;
}

.search-input {
  width: 180px;
  padding: 0 10px;
  border-radius: 8px;
}

.home-layout {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 24px;
  align-items: start;
}

.home-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card,
.latest-list-block {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.post-title {
  margin: 0;
  font-size: 34px;
  line-height: 1.25;
}

.post-excerpt {
  margin: 16px 0;
}

.post-meta,
.list-date {
  color: #6b7280;
  font-size: 14px;
}

.section-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.latest-list,
.sidebar-list {
  margin: 14px 0 0;
  padding-left: 20px;
}

.latest-list li,
.sidebar-list li {
  margin-bottom: 10px;
}

.home-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-module {
  border: 1px solid #dde3eb;
  border-radius: 12px;
  background: #f7f9fc;
  padding: 18px;
}

.module-title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 600;
}

.sidebar-module p {
  margin: 0 0 10px;
}

.divider {
  margin: 0 8px;
  color: #9ca3af;
}

.home-page :deep(a) {
  color: #007bff;
  text-decoration: none;
}

.home-page :deep(a:hover) {
  text-decoration: underline;
}

.read-more {
  color: #007bff;
}

@media (max-width: 767.98px) {
  .home-layout {
    grid-template-columns: 1fr;
  }

  .site-title {
    font-size: 32px;
  }

  .header-actions {
    width: 100%;
  }

  .search-input {
    flex: 1;
    width: auto;
  }
}
</style>
