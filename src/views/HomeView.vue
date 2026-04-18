<template>
  <section class="home-page">
    <header class="intro-grid">
      <div class="intro-copy">
        <h1>Hey, I'm dust!</h1>
        <p>
          我是一名前端工程师，专注于工程化、可维护性和可复用组件设计。
          这个博客只放精华内容，完整推导和过程笔记统一放在语雀。
        </p>
        <p>Everything on this site is written by me.</p>

        <div class="intro-actions">
          <RouterLink to="/about">💾 About Me</RouterLink>
          <a href="https://www.yuque.com/" target="_blank" rel="noreferrer">📚 语雀笔记</a>
        </div>
      </div>

      <div class="intro-visual" aria-hidden="true">
        <div class="visual-circle">
          <img :src="heroImage" alt="" />
        </div>
      </div>
    </header>

    <section class="preview-section">
      <h2>🧵 Blog</h2>
      <p>Guides, references, and tutorials.</p>

      <ul class="preview-list">
        <li v-for="post in blogPreview" :key="post.slug">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <RouterLink :to="`/article/${post.slug}`">{{ post.title }}</RouterLink>
        </li>
      </ul>
    </section>

    <section class="preview-section">
      <h2>📝 Notes</h2>
      <p>Life, review notes, and personal records.</p>

      <ul class="preview-list">
        <li v-for="post in notePreview" :key="post.slug">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <RouterLink :to="`/article/${post.slug}`">{{ post.title }}</RouterLink>
        </li>
      </ul>
    </section>

    <section class="preview-section">
      <h2>👾 Projects</h2>
      <p>Open-source projects and practical demos.</p>

      <div class="project-grid">
        <article v-for="project in projectPreview" :key="project.name" class="project-card">
          <p class="project-year">{{ project.year }}</p>
          <h3>{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-actions">
            <a v-if="project.articleUrl" :href="project.articleUrl">Article</a>
            <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noreferrer">Demo</a>
            <a :href="project.sourceUrl" target="_blank" rel="noreferrer">Source</a>
          </div>
        </article>
      </div>
    </section>

    <footer class="home-footer">
      <a href="https://www.yuque.com/" target="_blank" rel="noreferrer">语雀</a>
      <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import heroImage from '@/assets/home/hero-circle.jpg'
import { projectCards } from '@/data/projects'
import { loadAllPosts, type PostMeta } from '@/utils/markdown'

const posts = ref<PostMeta[]>([])

const blogPreview = computed(() => posts.value.filter((post) => post.type === 'blog').slice(0, 3))
const notePreview = computed(() => posts.value.filter((post) => post.type === 'note').slice(0, 4))
const projectPreview = computed(() => projectCards.slice(0, 6))

const formatDate = (isoDate: string): string => {
  const parsed = new Date(isoDate)

  if (Number.isNaN(parsed.getTime())) {
    return isoDate
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric'
  }).format(parsed)
}

onMounted(async () => {
  posts.value = await loadAllPosts()
})
</script>

<style scoped>
.home-page {
  max-width: 1140px;
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 28px;
  align-items: center;
}

.intro-copy h1 {
  margin: 0;
  font-size: clamp(36px, 4.2vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.intro-copy p {
  margin: 18px 0 0;
  color: var(--muted-strong);
  font-size: clamp(15px, 1.2vw, 22px);
  line-height: 1.65;
}

.intro-actions {
  margin-top: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.intro-actions a {
  height: 44px;
  border: 2px solid var(--line);
  border-radius: 9px;
  background: var(--panel);
  color: var(--link);
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
}

.intro-actions a:hover {
  background: var(--panel-hover);
}

.intro-visual {
  display: flex;
  justify-content: center;
}

.visual-circle {
  width: 260px;
  height: 260px;
  border-radius: 999px;
  overflow: hidden;
}

.visual-circle img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.preview-section {
  margin-top: 44px;
}

.preview-section h2 {
  margin: 0;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.preview-section > p {
  margin: 12px 0 0;
  color: var(--muted-strong);
  font-size: clamp(14px, 1.05vw, 18px);
}

.preview-list {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.preview-list li {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.preview-list time {
  color: var(--muted);
  font-size: 16px;
}

.preview-list a {
  color: var(--link);
  text-decoration: none;
  font-size: clamp(17px, 1.35vw, 24px);
  font-weight: 700;
  line-height: 1.35;
}

.preview-list a:hover {
  text-decoration: underline;
}

.project-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.project-card {
  border: 2px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  padding: 14px;
}

.project-year {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
}

.project-card h3 {
  margin: 8px 0 0;
  color: var(--link);
  font-size: 22px;
  line-height: 1.2;
}

.project-desc {
  margin: 8px 0 0;
  color: var(--muted-strong);
  font-size: 13px;
  line-height: 1.55;
}

.project-actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-actions a {
  height: 32px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel-soft);
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
}

.project-actions a:hover {
  background: var(--panel-hover);
}

.home-footer {
  margin-top: 42px;
  border-top: 1px solid var(--line);
  padding-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.home-footer a {
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
}

.home-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 1000px) {
  .intro-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .intro-visual {
    justify-content: flex-start;
  }

  .visual-circle {
    width: 180px;
    height: 180px;
  }

  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .intro-copy p,
  .preview-section > p,
  .preview-list time,
  .project-desc,
  .home-footer a {
    font-size: 14px;
  }

  .intro-actions a,
  .project-actions a {
    font-size: 13px;
  }

  .preview-list li {
    grid-template-columns: 96px minmax(0, 1fr);
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
