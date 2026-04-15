<template>
  <main class="post-detail-page">
    <article class="post-reader">
      <header class="post-header">
        <p class="post-date">{{ postDate || '未设置日期' }}</p>
        <h1 class="post-title">{{ postTitle }}</h1>

        <div v-if="postTags.length" class="post-tag-list" aria-label="标签">
          <span
            v-for="tag in postTags"
            :key="tag"
            class="post-tag-badge"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <section class="post-content">
        <p v-if="loading" class="post-loading">正在加载文章...</p>
        <p v-else-if="errorMessage" class="post-error">{{ errorMessage }}</p>
        <article
          v-else
          class="markdown-body"
          v-html="renderedBody"
        />
      </section>

      <nav class="post-breadcrumb" aria-label="breadcrumb">
        <RouterLink to="/">首页</RouterLink>
        <span class="crumb-sep">/</span>
        <RouterLink to="/blog">博客</RouterLink>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">详情</span>
      </nav>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { fetchMarkdown, parseFrontmatter } from '@/utils/markdown'

const props = defineProps<{
  slug: string
}>()

const postTitle = ref('加载中...')
const postDate = ref('')
const postTags = ref<string[]>([])
const renderedBody = ref('')
const loading = ref(true)
const errorMessage = ref('')

const loadArticle = async (): Promise<void> => {
  loading.value = true
  errorMessage.value = ''

  try {
    const markdown = await fetchMarkdown(props.slug)
    const { meta, body } = parseFrontmatter(markdown)

    postTitle.value = meta.title || props.slug
    postDate.value = meta.date || ''
    postTags.value = Array.isArray(meta.tags) ? meta.tags : []

    const parsedHtml = await marked.parse(body)
    renderedBody.value = DOMPurify.sanitize(parsedHtml)
  } catch (error) {
    postTitle.value = '文章不存在'
    postDate.value = ''
    postTags.value = []
    renderedBody.value = ''
    errorMessage.value = error instanceof Error ? error.message : '加载文章失败。'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.slug,
  () => {
    void loadArticle()
  },
  { immediate: true }
)
</script>

<style scoped>
.post-detail-page {
  padding: 36px 20px 56px;
}

.post-reader {
  max-width: 720px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 24px;
}

.post-date {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.post-title {
  margin: 10px 0 0;
  font-size: 42px;
  line-height: 1.2;
  font-weight: 800;
  color: #111;
}

.post-tag-list {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  font-size: 13px;
}

.post-content {
  padding-top: 8px;
}

.post-loading {
  color: #475569;
}

.post-error {
  color: #b91c1c;
}

.markdown-body {
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.markdown-body :deep(p) {
  margin: 0 0 20px;
}

.markdown-body :deep(h1) {
  margin: 32px 0 18px;
  font-size: 36px;
  line-height: 1.25;
  font-weight: 700;
  color: #111;
}

.markdown-body :deep(h2) {
  margin: 40px 0 20px;
  font-size: 31px;
  line-height: 1.3;
  font-weight: 700;
  color: #111;
}

.markdown-body :deep(h3) {
  margin: 28px 0 16px;
  font-size: 24px;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 20px 1.35em;
  padding: 0;
}

.markdown-body :deep(li) {
  margin-bottom: 10px;
}

.markdown-body :deep(ul li::marker) {
  color: #2563eb;
}

.markdown-body :deep(blockquote) {
  margin: 24px 0;
  border-left: 4px solid #2563eb;
  background: #f8fafc;
  padding: 12px 16px;
  color: #475569;
}

.markdown-body :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(pre) {
  margin: 0 0 20px;
  overflow-x: auto;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  padding: 0.8rem;
}

.markdown-body :deep(code) {
  background: #eff6ff;
  border-radius: 4px;
  padding: 0.05rem 0.25rem;
}

.markdown-body :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.post-breadcrumb {
  margin-top: 42px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #94a3b8;
}

.post-breadcrumb :deep(a) {
  color: #64748b;
  text-decoration: none;
}

.post-breadcrumb :deep(a:hover) {
  text-decoration: underline;
}

.crumb-sep {
  color: #cbd5e1;
}

.crumb-current {
  color: #94a3b8;
}
</style>
