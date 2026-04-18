<template>
  <div class="site-shell">
    <aside class="sidebar">
      <div class="brand-row">
        <span class="brand-icon" aria-hidden="true">💾</span>
        <span class="brand-name">dust blog</span>
        <div ref="colorPickerRef" class="color-picker-wrap">
          <button
            type="button"
            class="color-toggle"
            aria-label="切换主题色"
            title="切换主题色"
            @click="toggleColorMenu"
          >
            <span class="status-dot" aria-hidden="true"></span>
          </button>

          <span class="color-tooltip" aria-hidden="true">Color</span>

          <div v-if="colorMenuOpen" class="color-menu" role="menu" aria-label="主题色选择">
            <button
              v-for="item in accentOptions"
              :key="item.key"
              type="button"
              class="color-option"
              :class="{ 'color-option-active': item.key === accentMode }"
              :aria-label="`切换到${item.label}`"
              :title="item.label"
              :style="{ '--option-color': item.preview }"
              @click="setAccent(item.key)"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="theme-toggle"
          :aria-label="themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
          :title="themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ themeMode === 'light' ? '☾' : '☀' }}</span>
        </button>
      </div>

      <section class="side-block">
        <h2>About Me</h2>
        <p>
          我是 dust，前端工程师。这里是我的数字花园：博客只放精华，语雀放完整笔记，GitHub 放可运行项目。
        </p>
      </section>

      <nav class="side-block nav-block" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.to) }"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <section class="side-block connect-block">
        <h2>Stay Connected</h2>
        <a :href="contactLinks.yuque" target="_blank" rel="noreferrer">语雀</a>
        <a :href="contactLinks.github" target="_blank" rel="noreferrer">GitHub</a>
      </section>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
type ThemeMode = 'light' | 'dark'
const THEME_STORAGE_KEY = 'dust-blog-theme'
const ACCENT_STORAGE_KEY = 'dust-blog-accent'
const themeMode = ref<ThemeMode>('light')
const colorMenuOpen = ref(false)
const colorPickerRef = ref<HTMLElement | null>(null)

const accentOptions = [
  {
    key: 'purple',
    label: 'Purple',
    preview: '#cc8bf2',
    light: { link: '#b06ad7', status: '#cc8bf2', active: '#eadcf5', pill: '#f0e4f7', lineStrong: '#c8a2df' },
    dark: { link: '#d89cff', status: '#cc8bf2', active: '#3a2a49', pill: '#31263f', lineStrong: '#6f5185' }
  },
  {
    key: 'pink',
    label: 'Pink',
    preview: '#eb7ec2',
    light: { link: '#d65ea8', status: '#eb7ec2', active: '#f5dceb', pill: '#f8e6f1', lineStrong: '#dfa6c5' },
    dark: { link: '#ff9ad5', status: '#eb7ec2', active: '#4a2a3d', pill: '#402336', lineStrong: '#87526f' }
  },
  {
    key: 'yellow',
    label: 'Yellow',
    preview: '#f2cc68',
    light: { link: '#b98f1d', status: '#d8ab3a', active: '#f2e6c4', pill: '#f8f0d9', lineStrong: '#d3ba7a' },
    dark: { link: '#ffd96d', status: '#f2cc68', active: '#4a3f24', pill: '#403720', lineStrong: '#8d7a48' }
  },
  {
    key: 'green',
    label: 'Green',
    preview: '#80d09b',
    light: { link: '#2f8f5d', status: '#57b979', active: '#d8edde', pill: '#e5f5eb', lineStrong: '#8dc8a5' },
    dark: { link: '#89e1ac', status: '#80d09b', active: '#274536', pill: '#213b2e', lineStrong: '#4f8768' }
  },
  {
    key: 'blue',
    label: 'Blue',
    preview: '#66a9ff',
    light: { link: '#2f71b6', status: '#2f71b6', active: '#d8e7f7', pill: '#e4eef9', lineStrong: '#8db0d9' },
    dark: { link: '#8ab7ff', status: '#66a9ff', active: '#2a3a54', pill: '#243248', lineStrong: '#4d6992' }
  }
] as const

type AccentKey = (typeof accentOptions)[number]['key']
const accentMode = ref<AccentKey>('blue')

const navItems = [
  { label: 'Blog', to: '/blog', icon: '🧵' },
  { label: 'Notes', to: '/notes', icon: '📝' },
  { label: 'Projects', to: '/projects', icon: '👾' },
  { label: 'About Me', to: '/about', icon: '💾' }
]

const contactLinks = {
  yuque: 'https://www.yuque.com/',
  github: 'https://github.com/',
  rss: '/blog'
}

const isActive = (target: string): boolean => {
  return route.path === target
}

const isAccentKey = (value: string): value is AccentKey => {
  return accentOptions.some((item) => item.key === value)
}

const currentAccent = computed(() => {
  return accentOptions.find((item) => item.key === accentMode.value) ?? accentOptions[accentOptions.length - 1]
})

const applyTheme = (mode: ThemeMode): void => {
  document.documentElement.setAttribute('data-theme', mode)
  themeMode.value = mode
}

const applyAccent = (accent: AccentKey, mode: ThemeMode): void => {
  const palette = accentOptions.find((item) => item.key === accent)
  if (!palette) {
    return
  }

  const tones = mode === 'dark' ? palette.dark : palette.light
  const root = document.documentElement

  root.style.setProperty('--link', tones.link)
  root.style.setProperty('--status', tones.status)
  root.style.setProperty('--active', tones.active)
  root.style.setProperty('--pill', tones.pill)
  root.style.setProperty('--line-strong', tones.lineStrong)
  root.style.setProperty('--accent-color', palette.preview)

  accentMode.value = accent
}

const setAccent = (accent: AccentKey): void => {
  applyAccent(accent, themeMode.value)
  localStorage.setItem(ACCENT_STORAGE_KEY, accent)
  colorMenuOpen.value = false
}

const toggleColorMenu = (): void => {
  colorMenuOpen.value = !colorMenuOpen.value
}

const handleOutsidePointerDown = (event: PointerEvent): void => {
  if (!colorMenuOpen.value) {
    return
  }

  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (colorPickerRef.value?.contains(target)) {
    return
  }

  colorMenuOpen.value = false
}

const toggleTheme = (): void => {
  const nextMode: ThemeMode = themeMode.value === 'light' ? 'dark' : 'light'
  applyTheme(nextMode)
  applyAccent(accentMode.value, nextMode)
  localStorage.setItem(THEME_STORAGE_KEY, nextMode)
}

onMounted(() => {
  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  const initialTheme: ThemeMode = cachedTheme === 'dark' ? 'dark' : 'light'
  const cachedAccent = localStorage.getItem(ACCENT_STORAGE_KEY)
  const initialAccent: AccentKey = cachedAccent && isAccentKey(cachedAccent) ? cachedAccent : 'blue'

  applyTheme(initialTheme)
  applyAccent(initialAccent, initialTheme)
  window.addEventListener('pointerdown', handleOutsidePointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleOutsidePointerDown)
})
</script>

<style>
:root {
  --bg: #f3f1e6;
  --card: #efecdf;
  --panel: #f3ecd7;
  --panel-soft: #efe8d3;
  --panel-hover: #e6dcc0;
  --line: #ddd6c4;
  --line-strong: #d2c5a4;
  --text: #1f2430;
  --muted: #576074;
  --muted-strong: #434e61;
  --link: #2f71b6;
  --danger: #b91c1c;
  --pill: #e8e1cd;
  --active: #dfd8c1;
  --status: #2f71b6;
  --accent-color: #66a9ff;
  --theme-btn: #1f2430;
  --body-start: #f7f5eb;
  --body-end: #f1eedf;
}

:root[data-theme='dark'] {
  --bg: #1c2029;
  --card: #242a35;
  --panel: #2a313d;
  --panel-soft: #303846;
  --panel-hover: #374253;
  --line: #343c4a;
  --line-strong: #4a5567;
  --text: #e5e9f0;
  --muted: #b5bfce;
  --muted-strong: #c8d1de;
  --link: #8ab7ff;
  --danger: #ff8b8b;
  --pill: #2a313d;
  --active: #303846;
  --status: #67a7ff;
  --accent-color: #66a9ff;
  --theme-btn: #f6c865;
  --body-start: #171b22;
  --body-end: #12161d;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: 'Avenir Next', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text);
  background: linear-gradient(180deg, var(--body-start) 0%, var(--body-end) 100%);
}

a {
  color: var(--link);
}

.site-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
}

.sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  min-height: 100vh;
  border-right: 1px solid var(--line);
  background: var(--bg);
  padding: 32px 26px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.01em;
}

.brand-icon,
.theme-toggle {
  font-size: 20px;
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: lowercase;
}

.color-picker-wrap {
  margin-left: auto;
  position: relative;
  z-index: 2;
}

.color-toggle {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 999px;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.color-toggle:hover {
  background: transparent;
}

.color-toggle .status-dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--accent-color);
}

.color-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
}

.color-picker-wrap:hover .color-tooltip {
  opacity: 1;
}

.color-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 48px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  box-shadow: 0 10px 24px rgba(8, 12, 20, 0.3);
  padding: 8px 0;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.color-option {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: var(--option-color);
  padding: 0;
  cursor: pointer;
  position: relative;
}

.color-option-active::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
}

.theme-toggle {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--theme-btn);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  line-height: 1;
}

.theme-toggle:hover {
  background: var(--pill);
}

.side-block {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.side-block h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.side-block p {
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.75;
  font-size: 14px;
}

.nav-block {
  display: grid;
  gap: 8px;
}

.nav-link {
  height: 44px;
  border-radius: 10px;
  padding: 0 12px;
  text-decoration: none;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
}

.nav-link:hover {
  background: var(--pill);
}

.nav-link-active {
  background: var(--active);
}

.nav-icon {
  width: 24px;
  text-align: center;
  font-size: 20px;
}

.connect-block {
  display: grid;
  gap: 10px;
}

.connect-block a {
  width: fit-content;
  text-decoration: none;
  font-size: 13px;
}

.connect-block a:hover {
  text-decoration: underline;
}

.main-content {
  padding: 56px 72px;
  min-width: 0;
}

@media (max-width: 1200px) {
  .main-content {
    padding: 36px 34px;
  }

  .brand-name,
  .side-block h2 {
    font-size: 18px;
  }

  .nav-link {
    font-size: 15px;
  }
}

@media (max-width: 960px) {
  .site-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid var(--line);
    padding: 16px;
  }

  .brand-row {
    font-size: 20px;
  }

  .brand-name {
    font-size: 24px;
  }

  .status-dot {
    width: 12px;
    height: 12px;
  }

  .side-block {
    margin-top: 14px;
    padding-top: 12px;
  }

  .side-block h2,
  .nav-link {
    font-size: 17px;
  }

  .side-block p {
    margin-top: 8px;
    font-size: 14px;
  }

  .nav-link {
    height: 44px;
  }

  .main-content {
    padding: 20px 16px 30px;
  }
}
</style>
