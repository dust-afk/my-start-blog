
<template>
  <section class="about-page">
    <header class="about-head">
      <h1><span aria-hidden="true">💾</span> 关于我</h1>
      <p class="title-sub"> 👾 It's xiaoai</p>
    </header>

    <p class="opening-quote"> xiaoai - 一个热爱代码与生活的前端开发者</p>

    <section class="section-block about-story">
      <h2> 我的故事</h2>

      <p class="identity-line">
        <em>frontend developer</em>
        <span>|</span>
        <em>learner</em>
        <span>|</span>
        <em>runner</em>
      </p>

      <ol class="story-list">
        <li>
          <strong>职业身份：</strong>
          我是一名前端开发工程师，专注于构建优雅的用户体验。
        </li>
        <li>
          <strong>成长理念：</strong>
          我相信"越努力越幸运"，因此每天都在持续学习。不仅深耕前端技术，更热衷于探索一切新鲜事物，拥抱每一个未知的挑战。
        </li>
        <li>
          <strong>博客初心：</strong>
          这里记录着我的前端学习笔记、个人爱好分享与生活感悟，希望每一位访客都能在这里有所收获。
        </li>
      </ol>
    </section>

    <!-- 修改：照片区域 -->
    <section class="about-grid section-block photo-block">
      <div class="photo-narrative">
        <h2>📷 照片区域</h2>
        <p class="narrative-quote">✨ 代码是逻辑的诗，生活是灵感的源</p>

        <div class="life-slices">
          <button class="slice-btn" title="技术笔记">
            <span>📝</span> 技术笔记
          </button>
          <button class="slice-btn" title="深夜调试">
            <span>🌙</span> 深夜调试
          </button>
          <button class="slice-btn" title="晨跑充电">
            <span>🏃</span> 晨跑充电
          </button>
          <button class="slice-btn" title="设计草图">
            <span>🎨</span> 设计草图
          </button>
        </div>

        <p class="photo-note">
          这张图摄于春日午后 · 书页间飘落的金雀花，像一行未提交的 commit message 🌼
        </p>
      </div>

      <figure class="about-photo">
        <img 
          :src="aboutImage" 
          alt="一本摊开的技术书，洒落金雀花与晨光，旁置清水杯——象征前端开发者在理性与感性间平衡成长" 
          @error="handleAboutImageError"
        />
        <div class="status-badge">🌱 正在重构博客主题</div>
      </figure>
    </section>

    <section class="section-block">
      <h2>🤝 联系我</h2>
      <ul class="link-list">
        <li>
          <strong>Email：</strong>
          <a href="mailto:1780214897@qq.com">1780214897@qq.com</a>
        </li>
        <li>
          <strong>GitHub：</strong>
          <a href="https://github.com/dust/afk" target="_blank" rel="noreferrer">github.com/dust/afk</a>
        </li>
        <li>
          <strong>Phone：18784859692</strong>
        </li>
      </ul>
    </section>

    <section class="section-block">
      <h2>🔄 最近在忙什么呢</h2>
      <p class="updated-at">更新时间：2026.4.18</p>

      <ul class="todo-list">
        <li><span aria-hidden="true">☐</span> <strong>技术精进：</strong>深入学习现代前端框架与工程化实践</li>
        <li><span aria-hidden="true">☐</span> <strong>健康生活：</strong>坚持每日跑步，保持身心活力</li>
        <li><span aria-hidden="true">☐</span> <strong>独处时光：</strong>享受安静思考，沉淀内心世界</li>
      </ul>
    </section>

    <section class="section-block">
      <h2>🎵 我的音乐时光</h2>
      <ul class="link-list">
        <li>
          <strong>童话</strong> - 光良 |
          <a href="https://music.163.com/song?id=xxxx" target="_blank" rel="noreferrer">网易云链接</a>
          | <em>经典治愈系，总能唤起美好回忆</em>
        </li>
      </ul>
    </section>

    <section class="section-block">
      <h2>📋 技能</h2>
      <ul class="link-list">
        <li>
          <strong>Resume</strong> -
          <RouterLink to="/resume">查看简历</RouterLink>
          | <em>技术历程与项目经验汇总</em>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import fallbackAboutImage from '@/assets/home/profile-cover.jpg'

const aboutImage = ref('/images/about-me.jpg')

const handleAboutImageError = (): void => {
  aboutImage.value = fallbackAboutImage
}
</script>

<style scoped>
.about-page {
  max-width: 1180px;
}

.about-head h1 {
  margin: 0;
  font-size: clamp(34px, 3.8vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-family: 'SimSun', 'Songti SC', 'STSong', serif;
}

.about-head h1 span {
  margin-right: 10px;
  font-size: 0.8em;
}

.title-sub {
  margin: 14px 0 0;
  font-size: clamp(18px, 2vw, 28px);
  font-weight: 700;
  color: var(--text);
}

.opening-quote {
  margin: 26px 0 0;
  border-left: 4px solid var(--line-strong);
  padding: 8px 0 8px 14px;
  color: var(--muted-strong);
  font-size: clamp(14px, 1.05vw, 18px);
  line-height: 1.7;
}

.section-block {
  margin-top: 34px;
  border-top: 1px solid var(--line);
  padding-top: 22px;
}

.section-block h2 {
  margin: 0;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-family: 'SimSun', 'Songti SC', 'STSong', serif;
}

.identity-line {
  margin: 20px 0 0;
  color: var(--muted);
  font-size: clamp(14px, 1vw, 17px);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.identity-line span {
  color: var(--muted);
}

.story-list {
  margin: 20px 0 0;
  padding-left: 1.2em;
  color: var(--muted-strong);
  font-size: clamp(15px, 1.02vw, 18px);
  line-height: 1.75;
}

.story-list li + li {
  margin-top: 12px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: start;
}

/* === 照片叙事区 === */
.photo-narrative {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.narrative-quote {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: clamp(14px, 1.05vw, 16px);
  font-style: italic;
  line-height: 1.6;
}

.life-slices {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 10px;
}

.slice-btn {
  background: var(--panel-soft);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 14px;
  color: var(--muted-strong);
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}

.slice-btn:hover {
  background: var(--panel-hover);
  border-color: var(--line-strong);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
}

.slice-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--link) 28%, transparent);
}

.photo-note {
  margin-top: 10px;
  font-size: 15px;
  color: var(--muted);
  line-height: 1.5;
  padding-left: 4px;
  border-left: 2px dashed var(--line);
}

/* 图片区域微调 */
.about-photo {
  margin: 0;
  position: relative;
  /* 让图片更“沉稳”，避免漂浮感 */
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
}

.about-photo img {
  display: block;
  width: 100%;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.about-photo:hover img {
  transform: scale(1.01);
}

.status-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: color-mix(in srgb, var(--card) 92%, transparent);
  backdrop-filter: blur(6px);
  color: var(--muted-strong);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  border: 1px solid rgba(0,0,0,0.08);
  font-weight: 500;
  white-space: nowrap;
}

.link-list {
  margin: 16px 0 0;
  padding-left: 1.2em;
  color: var(--muted-strong);
  font-size: clamp(15px, 1.02vw, 18px);
  line-height: 1.75;
}

.link-list li + li {
  margin-top: 4px;
}

.link-list a {
  color: var(--link);
  font-weight: 700;
}

.updated-at {
  margin: 18px 0 0;
  color: var(--muted);
  font-size: clamp(15px, 1vw, 18px);
  font-style: italic;
}

.todo-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  color: var(--muted-strong);
  font-size: clamp(15px, 1vw, 18px);
  line-height: 1.75;
}

.todo-list li {
  display: flex;
  gap: 10px;
}

.todo-list li + li {
  margin-top: 6px;
}

@media (max-width: 1000px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .life-slices {
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .opening-quote,
  .story-list,
  .narrative-quote,
  .photo-note,
  .link-list,
  .updated-at,
  .todo-list {
    font-size: 14px;
  }
  
  .life-slices {
    justify-content: flex-start;
  }
}
</style>
