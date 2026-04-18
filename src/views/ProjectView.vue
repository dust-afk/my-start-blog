<template>
  <section class="projects-page">
    <header class="projects-head">
      <h1><span aria-hidden="true">👾</span> Projects</h1>
      <p>项目代码统一放在 GitHub，文章只保留核心设计与最小实现。</p>
    </header>

    <section class="project-grid">
      <article v-for="project in projectCards" :key="project.name" class="project-card">
        <header class="card-head">
          <span class="year">{{ project.year }}</span>
          <strong class="stars">{{ project.stars.toLocaleString() }} ☆</strong>
        </header>

        <h2>{{ project.name }}</h2>
        <p>{{ project.description }}</p>

        <div class="actions">
          <a v-if="project.articleUrl" :href="project.articleUrl">Article</a>
          <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noreferrer">Demo</a>
          <a :href="project.sourceUrl" target="_blank" rel="noreferrer">Source</a>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { projectCards } from '@/data/projects'
</script>

<style scoped>
.projects-page {
  max-width: 1100px;
}

.projects-head h1 {
  margin: 0;
  font-size: clamp(36px, 4.2vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.projects-head h1 span {
  margin-right: 10px;
  font-size: 0.8em;
}

.projects-head p {
  margin: 20px 0 0;
  max-width: 900px;
  font-size: clamp(14px, 1.35vw, 18px);
  line-height: 1.5;
  color: var(--muted-strong);
}

.project-grid {
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.project-card {
  border: 2px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  padding: 16px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.year {
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
}

.stars {
  color: var(--text);
  font-size: 18px;
}

.project-card h2 {
  margin: 10px 0 0;
  color: var(--link);
  font-size: clamp(18px, 1.6vw, 24px);
  line-height: 1.2;
}

.project-card p {
  margin: 12px 0 0;
  color: var(--muted-strong);
  font-size: 15px;
  line-height: 1.5;
}

.actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions a {
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  color: var(--text);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
}

.actions a:hover {
  background: var(--panel-hover);
}

@media (max-width: 1100px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .projects-head p {
    font-size: 16px;
  }

  .project-grid {
    margin-top: 20px;
    grid-template-columns: 1fr;
  }

  .year,
  .stars,
  .project-card p {
    font-size: 16px;
  }

  .project-card h2 {
    font-size: 20px;
  }
}
</style>
