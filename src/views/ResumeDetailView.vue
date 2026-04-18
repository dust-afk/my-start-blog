<template>
  <section class="resume-page">
    <div class="resume-toolbar no-print">
      <button type="button" class="print-btn" @click="printResume">下载 PDF</button>
    </div>

    <header class="resume-header">
      <h1>Xiao Ai</h1>

      <ul class="contact-list">
        <li>
          <strong>Email</strong> -
          <a href="mailto:1780214897@qq.com">1780214897@qq.com</a>
        </li>
        <li>
          <strong>GitHub</strong> -
          <a href="https://github.com/dust-afk" target="_blank" rel="noreferrer">github.com/dust-afk</a>
        </li>
        <li>
          <strong>个人网站/博客</strong> -
          <a href="https://dust-afk.github.io" target="_blank" rel="noreferrer">dust-afk.github.io</a>
        </li>
      </ul>
    </header>

    <section class="resume-section">
      <h2><span aria-hidden="true">🔗</span> 项目经历</h2>

      <article class="project-item">
        <h3>Vue3实战商城后台管理系统</h3>
        <p class="project-meta"><strong>【前端开发】</strong></p>
        <p class="project-date">【2025.12】 - 【2026.2】</p>
        <ul>
          <li>基于 Vue3 + TypeScript + Element Plus 构建，实现用户管理、商品管理、订单处理等核心功能模块</li>
          <li>集成 Pinia 状态管理，采用 Composition API 优化组件复用，减少代码重复率达 40%</li>
          <li>设计响应式布局适配多终端，集成权限控制与数据可视化图表，提升管理员操作效率</li>
        </ul>
      </article>

      <article class="project-item">
        <h3>仿爱彼迎 React 项目</h3>
        <p class="project-meta"><strong>【前端开发】</strong></p>
        <p class="project-date">【2026.2】 - 【2026.3】</p>
        <ul>
          <li>使用 React 18 + Hooks + Context 构建，模拟 Airbnb 房源搜索、预订等核心交互体验</li>
          <li>实现地图集成（Leaflet）、实时搜索过滤、房源详情页动画等复杂 UI 功能</li>
          <li>采用移动端优先策略，确保跨平台一致性，优化加载速度至 2s 内首屏渲染</li>
        </ul>
      </article>

      <article class="project-item">
        <h3>心理健康 AI 助手项目</h3>
        <p class="project-meta"><strong>【前端开发】</strong></p>
        <p class="project-date">【2026.3】 - 【2026.4】</p>
        <ul>
          <li>基于 React + Node.js + MongoDB 构建，集成自然语言处理接口，提供情绪分析与心理疏导对话功能</li>
          <li>设计隐私加密存储用户聊天记录，遵循数据保护原则，确保用户信息安全</li>
          <li>实现用户情感趋势可视化面板，帮助用户追踪心理健康状态变化</li>
        </ul>
      </article>

      <article class="project-item">
        <h3>个人博客项目搭建</h3>
        <p class="project-meta"><strong>【前端开发与运维】</strong></p>
        <p class="project-date">【2026.4】 - 【Present】</p>
        <ul>
          <li>采用 Next.js + Markdown + Tailwind CSS 构建静态博客站点，支持 SSR 与 SEO 优化</li>
          <li>集成评论系统与标签分类，实现文章归档与搜索功能，持续输出前端技术文章</li>
        </ul>
      </article>
    </section>

    <section class="resume-section">
      <h2>Skills</h2>
      <ul class="skill-list">
        <li><strong>前端框架</strong> - Vue.js, React, Next.js</li>
        <li><strong>编程语言</strong> - JavaScript (ES6+), TypeScript, HTML5, CSS3</li>
        <li><strong>UI 库/工具</strong> - Element Plus, Ant Design, Tailwind CSS</li>
        <li><strong>状态管理</strong> - Pinia, Redux</li>
        <li><strong>工程化</strong> - Vite, Git, ESLint, Prettier</li>
        <li><strong>部署运维</strong> - Docker, Vercel, GitHub Pages</li>
      </ul>
    </section>

    <section class="resume-section">
      <h2>附加信息</h2>
      <ul class="skill-list">
        <li><strong>技术博客</strong> - 分享前端开发实践经验与技术探索</li>
        <li><strong>兴趣爱好</strong> - 音乐、阅读</li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
const printResume = (): void => {
  window.print()
}
</script>

<style scoped>
.resume-page {
  max-width: 1240px;
}

.resume-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.print-btn {
  height: 42px;
  border: 2px solid var(--line-strong);
  border-radius: 9px;
  background: var(--panel);
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  padding: 0 14px;
  cursor: pointer;
}

.print-btn:hover {
  background: var(--panel-hover);
}

.resume-header h1 {
  margin: 0;
  font-size: clamp(40px, 4.5vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.contact-list {
  margin: 24px 0 0;
  padding-left: 1.1em;
  font-size: clamp(15px, 1vw, 18px);
  line-height: 1.6;
}

.contact-list a {
  color: var(--link);
  font-weight: 700;
}

.resume-section {
  margin-top: 42px;
}

.resume-section h2 {
  margin: 0;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
  font-size: clamp(30px, 3vw, 40px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.resume-section h2 span {
  margin-right: 10px;
  font-size: 0.5em;
}

.project-item {
  margin-top: 30px;
}

.project-item h3 {
  margin: 0;
  color: var(--muted-strong);
  font-size: clamp(24px, 2.2vw, 32px);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.project-meta {
  margin: 10px 0 0;
  color: var(--text);
  font-size: clamp(14px, 1vw, 17px);
}

.project-date {
  margin: 6px 0 0;
  color: var(--text);
  font-size: clamp(15px, 1.1vw, 20px);
  font-style: italic;
}

.project-item ul,
.skill-list {
  margin: 12px 0 0;
  padding-left: 1.1em;
  color: var(--text);
  font-size: clamp(15px, 1.05vw, 18px);
  line-height: 1.6;
}

.project-item li + li,
.skill-list li + li {
  margin-top: 6px;
}

@media (max-width: 960px) {
  .resume-page {
    max-width: 100%;
  }

  .resume-header h1 {
    font-size: clamp(36px, 9vw, 56px);
  }

  .contact-list,
  .project-item ul,
  .skill-list,
  .project-date,
  .project-meta {
    font-size: 16px;
  }

  .resume-section {
    margin-top: 34px;
  }

  .resume-section h2 {
    font-size: clamp(34px, 7.5vw, 46px);
  }

  .project-item {
    margin-top: 24px;
  }

  .project-item h3 {
    font-size: clamp(24px, 6vw, 34px);
  }
}

@media print {
  @page {
    size: A4;
    margin: 14mm 12mm;
  }

  :global(body) {
    background: #ffffff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  :global(.sidebar) {
    display: none !important;
  }

  :global(.site-shell) {
    display: block !important;
    min-height: auto !important;
  }

  :global(.main-content) {
    padding: 0 !important;
  }

  .no-print {
    display: none !important;
  }

  .resume-page {
    max-width: none;
    color: #111111;
  }

  .resume-header h1 {
    font-size: 34px;
    line-height: 1.15;
  }

  .contact-list {
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.45;
  }

  .resume-section {
    margin-top: 20px;
  }

  .resume-section h2 {
    padding-bottom: 6px;
    font-size: 24px;
    line-height: 1.2;
  }

  .project-item {
    margin-top: 14px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .project-item h3 {
    font-size: 18px;
    color: #202738;
  }

  .project-meta,
  .project-date {
    margin-top: 4px;
    font-size: 13px;
  }

  .project-item ul,
  .skill-list {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.45;
  }

  .project-item li + li,
  .skill-list li + li {
    margin-top: 2px;
  }
}
</style>
