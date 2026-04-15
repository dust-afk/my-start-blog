<template>
  <main class="blog-list-page">
    <div class="blog-list-container">
      <header class="blog-list-header">
        <h1 class="blog-list-title">博客文章</h1>
        <p class="blog-list-desc">基于 Markdown 文件加载文章列表。</p>
        <nav class="flex flex-wrap gap-3 text-sm">
          <RouterLink to="/" class="post-readmore">回首页</RouterLink>
          <RouterLink to="/resume" class="post-readmore">去简历</RouterLink>
        </nav>
      </header>

      <section class="tag-bar">
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="tag-pill"
          :class="{ 'tag-pill-active': tag === activeTag }"
          @click="activeTag = tag"
        >
          {{ tag }}
        </button>
      </section>

      <section class="post-list">
        <p v-if="loading" class="post-loading">正在加载文章...</p>
        <p v-else-if="displayPosts.length === 0" class="post-empty">当前标签下暂无文章。</p>

        <article
          v-for="post in displayPosts"
          :key="post.slug"
          class="post-card"
        >
          <p class="post-date">{{ post.date }}</p>

          <h2 class="post-title">
            <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
          </h2>

          <p class="post-excerpt">{{ post.cleanExcerpt }}</p>

          <RouterLink :to="`/blog/${post.slug}`" class="post-readmore">继续阅读全文</RouterLink>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadAllPosts, type PostMeta } from '@/utils/markdown'

type DisplayPost = PostMeta & {
  cleanExcerpt: string
}

const loading = ref(true)
const posts = ref<PostMeta[]>([])
const activeTag = ref('全部')

const allTags = computed(() => {
  const tagSet = new Set<string>(['全部'])

  posts.value.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag))
  })

  return Array.from(tagSet)
})

const filteredPosts = computed(() => {
  if (activeTag.value === '全部') {
    return posts.value
  }

  return posts.value.filter((post) => post.tags.includes(activeTag.value))
})

const cleanExcerpt = (input: string): string => {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/(^|\s)#{1,6}\s*/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const displayPosts = computed<DisplayPost[]>(() => {
  return filteredPosts.value.map((post) => ({
    ...post,
    cleanExcerpt: cleanExcerpt(post.excerpt)
  }))
})

onMounted(async () => {
  posts.value = await loadAllPosts()
  loading.value = false
})
</script>

<style scoped>
.blog-list-page {
  padding: 32px 16px 48px;
}

.blog-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 8px;
}

.blog-list-header {
  margin-bottom: 24px;
}

.blog-list-title {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  color: #111;
}

.blog-list-desc {
  margin: 10px 0 14px;
  color: #555;
  line-height: 1.6;
}

.tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}

.tag-pill {
  border: 1px solid #d6d6d6;
  background: #f2f2f2;
  color: #444;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-pill:hover {
  background: #5f6670;
  color: #fff;
}

.tag-pill-active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
}

.post-list {
  display: block;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 30px;
}

.post-date {
  margin: 0 0 10px;
  font-size: 13px;
  color: #888;
}

.post-title {
  margin: 0 0 14px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  color: #111;
}

.post-title :deep(a) {
  color: #111;
  text-decoration: none;
}

.post-excerpt {
  margin: 0 0 16px;
  line-height: 1.6;
  color: #444;
}

.post-readmore {
  color: #007bff;
  text-decoration: none;
}

.post-readmore:hover {
  text-decoration: underline;
}

.post-empty,
.post-loading {
  color: #666;
  line-height: 1.6;
}
</style>
