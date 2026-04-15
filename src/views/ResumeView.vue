<template>
  <main class="resume-page">
    <section class="resume-paper">
      <div class="resume-switch" role="tablist" aria-label="Resume Mode Switch">
        <button
          type="button"
          class="switch-btn"
          :class="{ 'switch-btn-active': mode === 'simple' }"
          @click="mode = 'simple'"
        >
          简洁版
        </button>
        <button
          type="button"
          class="switch-btn"
          :class="{ 'switch-btn-active': mode === 'detailed' }"
          @click="mode = 'detailed'"
        >
          详细版
        </button>
      </div>

      <header class="resume-header">
        <h1 class="resume-name">刘嫒</h1>
        <p class="resume-role">FRONTEND ENGINEER</p>
        <div class="resume-contact">
          <span>电话：18784859692</span>
          <span>邮箱：1780214897@qq.com</span>
        </div>
      </header>

      <section class="resume-content">
        <component :is="current" />
      </section>

      <footer class="resume-footer">
        <nav class="footer-links">
          <RouterLink to="/">← 回首页</RouterLink>
          <RouterLink to="/blog">← 去 Blog</RouterLink>
        </nav>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ResumeDetailed from '@/components/ResumeDetailed.vue'
import ResumeSimple from '@/components/ResumeSimple.vue'

type ResumeMode = 'simple' | 'detailed'

const mode = ref<ResumeMode>('simple')

const current = computed(() => {
  return mode.value === 'simple' ? ResumeSimple : ResumeDetailed
})
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 36px 16px;
}

.resume-paper {
  max-width: 750px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 32px 34px 28px;
}

.resume-switch {
  width: fit-content;
  margin: 0 auto;
  display: inline-flex;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  overflow: hidden;
  background: #fff;
}

.switch-btn {
  min-width: 110px;
  border: none;
  padding: 8px 16px;
  background: #fff;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.switch-btn-active {
  background: #1f2937;
  color: #fff;
}

.resume-header {
  margin-top: 24px;
  text-align: center;
}

.resume-name {
  margin: 0;
  font-size: 42px;
  line-height: 1.15;
  font-weight: 800;
  color: #111827;
}

.resume-role {
  margin: 12px 0 0;
  font-size: 13px;
  letter-spacing: 2px;
  font-weight: 600;
  color: #334155;
}

.resume-contact {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #6b7280;
}

.resume-content {
  margin-top: 28px;
}

.resume-footer {
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #eceff3;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-links :deep(a) {
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
}

.footer-links :deep(a:hover) {
  text-decoration: underline;
  color: #6b7280;
}

@media (max-width: 640px) {
  .resume-paper {
    padding: 24px 18px;
  }

  .resume-name {
    font-size: 36px;
  }

  .switch-btn {
    min-width: 96px;
  }
}
</style>
