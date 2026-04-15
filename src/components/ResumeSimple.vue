<template>
  <section class="resume-body">
    <section class="resume-module">
      <h2 class="module-title">教育背景</h2>
      <div class="edu-row">
        <span class="edu-time">2023.09 - 2027.06</span>
        <span class="edu-sep" aria-hidden="true">|</span>
        <span class="edu-school">成都工业学院</span>
        <span class="edu-major">信息工程（本科）</span>
      </div>
      <p class="module-note">荣誉：校级三等奖学金（2025年）、院级优秀学生干部（2023年）。</p>
    </section>

    <section class="resume-module">
      <h2 class="module-title">专业技能</h2>
      <ul class="resume-list">
        <li>编程语言：JavaScript、HTML5、CSS3、Python、C语言</li>
        <li>前端框架：Vue.js 生态（Vue Router、Vuex、Element UI、Vant UI），了解 React</li>
        <li>构建工具：Webpack、Vite</li>
        <li>开发工具：Git、VS Code、Chrome DevTools</li>
      </ul>
    </section>

    <section class="resume-module">
      <h2 class="module-title">项目经历</h2>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">Vue3 商城后台管理系统</span>
          <span class="item-time">2025.12 - 2026.03</span>
        </div>
        <p class="item-desc">负责 Vue3 Composition API 页面开发、权限管理和性能优化。</p>
      </article>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">React 仿爱彼迎项目</span>
          <span class="item-time">2026.03 - 2026.04</span>
        </div>
        <p class="item-desc">使用 React Hooks 与 Context API 实现房源展示、搜索筛选和响应式布局。</p>
      </article>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">个人博客网站</span>
          <span class="item-time">2023.08 - 2023.10</span>
        </div>
        <p class="item-desc">基于 Vue.js + Node.js 开发，完成前后台与部署上线。</p>
      </article>
    </section>

    <section class="resume-module">
      <h2 class="module-title">校园经历</h2>
      <p class="item-desc">电子与电气工程学院学生会学习部干事（2023.09 - 2024.09），组织学术讲座与学习分享活动。</p>
    </section>

    <section class="resume-module">
      <h2 class="module-title">自我评价</h2>
      <ul class="resume-list">
        <li>具备扎实的前端开发基础，对新技术保持持续学习热情。</li>
        <li>具备良好的沟通协作能力与代码质量意识。</li>
        <li>关注用户体验细节，适应能力强，能在压力下高效完成任务。</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.resume-body {
  color: #1f2937;
}

.resume-module + .resume-module {
  margin-top: 28px;
}

.module-title {
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 21px;
  font-weight: 700;
  color: #374151;
}

.edu-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.edu-time {
  min-width: 120px;
  color: #4b5563;
  font-weight: 500;
}

.edu-sep {
  color: #cbd5e1;
}

.edu-school {
  font-weight: 700;
  color: #111827;
}

.edu-major {
  color: #6b7280;
}

.module-note {
  margin: 8px 0 0;
  line-height: 1.7;
  color: #4b5563;
}

.resume-list {
  margin: 0;
  padding-left: 20px;
}

.resume-list li {
  margin-bottom: 8px;
  line-height: 1.7;
  color: #374151;
}

.resume-item + .resume-item {
  margin-top: 14px;
}

.item-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
}

.item-role {
  font-weight: 600;
  color: #111827;
}

.item-time {
  margin-left: auto;
  font-size: 14px;
  color: #6b7280;
}

.item-desc {
  margin: 8px 0 0;
  line-height: 1.7;
  color: #374151;
}

@media (max-width: 640px) {
  .edu-time {
    min-width: auto;
  }

  .edu-sep {
    display: none;
  }

  .item-time {
    margin-left: 0;
    width: 100%;
  }
}
</style>
