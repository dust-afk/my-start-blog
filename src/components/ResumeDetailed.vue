<template>
  <section class="resume-body">
    <section class="resume-module">
      <h2 class="module-title">个人信息</h2>
      <ul class="resume-list">
        <li><strong>姓名：</strong>刘嫒</li>
        <li><strong>电话：</strong>18784859692</li>
        <li><strong>邮箱：</strong>1780214897@qq.com</li>
      </ul>
    </section>

    <section class="resume-module">
      <h2 class="module-title">教育背景</h2>
      <div class="edu-row">
        <span class="edu-time">2023.09 - 2027.06</span>
        <span class="edu-sep" aria-hidden="true">|</span>
        <span class="edu-school">成都工业学院</span>
        <span class="edu-major">信息工程（本科）</span>
      </div>
      <ul class="resume-list module-list-gap">
        <li>主修课程：面向对象程序设计(C++)、数据结构、计算机网络、数据库原理、操作系统、高等数学、算法设计与分析、C语言、Python程序设计、Web程序设计、数字图像处理。</li>
        <li>荣誉：校级三等奖学金（2025年）、院级优秀学生干部（2023年）。</li>
      </ul>
    </section>

    <section class="resume-module">
      <h2 class="module-title">专业技能</h2>
      <ul class="resume-list">
        <li><strong>编程语言：</strong>熟练掌握 JavaScript、HTML5、CSS3，Python、C语言。</li>
        <li><strong>前端框架：</strong>熟练使用 Vue.js 生态（Vue Router、Vuex、Element UI、Vant UI），了解 React。</li>
        <li><strong>构建工具：</strong>熟悉 Webpack、Vite 等前端构建工具。</li>
        <li><strong>开发工具：</strong>熟练使用 Git、VS Code、Chrome DevTools。</li>
        <li><strong>UI 组件库：</strong>熟练使用 Element UI、Ant Design、Vant UI。</li>
      </ul>
    </section>
    <section class="resume-module">
      <h2 class="module-title">校园经历</h2>
      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">电子与电气工程学院学生会 | 学习部干事</span>
          <span class="item-time">2023.09 - 2024.09</span>
        </div>
        <ul class="resume-list module-list-gap">
          <li>组织开展学术讲座、学习经验分享会等活动。</li>
          <li>协助学院开展学风建设工作。</li>
          <li>负责部门内部管理和活动策划执行。</li>
        </ul>
      </article>
    </section>
    <section class="resume-module">
      <h2 class="module-title">项目经历</h2>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">1. Vue3 商城后台管理系统</span>
          <span class="item-time">2025.12 - 2026.03</span>
        </div>
        <p class="item-desc"><strong>项目描述：</strong>基于 Vue3 + Element Plus 开发，实现商品管理、订单管理、用户管理、数据统计等功能。</p>
        <ul class="resume-list module-list-gap">
          <li>负责前端页面开发，使用 Vue3 Composition API 进行组件开发。</li>
          <li>集成 Element Plus 组件库，设计用户友好的管理界面。</li>
          <li>实现权限管理功能，不同角色用户拥有不同操作权限。</li>
          <li>优化页面性能，提升数据展示和交互体验。</li>
        </ul>
      </article>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">2. React 仿爱彼迎项目</span>
          <span class="item-time">2026.03 - 2026.04</span>
        </div>
        <p class="item-desc"><strong>项目描述：</strong>基于 React 开发的民宿预订平台，实现房源展示、搜索筛选、预订管理等功能。</p>
        <ul class="resume-list module-list-gap">
          <li>使用 React Hooks 和 Context API 进行状态管理。</li>
          <li>实现响应式布局，适配不同屏幕尺寸。</li>
          <li>集成地图 API，展示房源地理位置信息。</li>
          <li>优化页面加载速度，提升用户体验。</li>
        </ul>
      </article>

      <article class="resume-item">
        <div class="item-head">
          <span class="item-role">3. 个人博客网站</span>
          <span class="item-time">2026.04</span>
        </div>
        <p class="item-desc"><strong>项目描述：</strong>基于 Vue.js + Node.js 开发的个人博客平台，支持文章发布、评论、分类管理等功能。</p>
        <ul class="resume-list module-list-gap">
          <li>设计并实现前后端分离架构。</li>
          <li>开发博客前台展示页面和后台管理界面。</li>
          <li>集成富文本编辑器，支持文章内容编辑。</li>
          <li>部署项目至云服务器，确保稳定运行。</li>
        </ul>
      </article>
    </section>

    

    <section class="resume-module">
      <h2 class="module-title">自我评价</h2>
      <ul class="resume-list">
        <li>具备扎实的前端开发基础，对新技术保持持续学习的热情。</li>
        <li>拥有良好的沟通能力和团队协作精神。</li>
        <li>注重代码质量，具备良好的编程习惯。</li>
        <li>对用户体验有敏锐的感知，注重产品细节。</li>
        <li>适应能力强，能够在压力下高效完成任务。</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.resume-body {
  color: #1f2937;
}

.resume-module + .resume-module {
  margin-top: 30px;
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

.resume-list {
  margin: 0;
  padding-left: 20px;
}

.module-list-gap {
  margin-top: 8px;
}

.resume-list li {
  margin-bottom: 8px;
  line-height: 1.75;
  color: #374151;
}

.resume-item + .resume-item {
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px dashed #e5e7eb;
}

.item-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
}

.item-role {
  font-weight: 700;
  color: #111827;
}

.item-time {
  margin-left: auto;
  font-size: 14px;
  color: #6b7280;
}

.item-desc {
  margin: 8px 0 0;
  line-height: 1.75;
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
