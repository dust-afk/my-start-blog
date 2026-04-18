<template>
  <section class="archive-page">
    <header class="archive-head">
      <h1><span aria-hidden="true">📝</span> Notes</h1>
      <p>
        个人速查手册：结论优先、最小示例、可快速复用。
        <RouterLink to="/notes/topics">View all posts.</RouterLink>
      </p>
    </header>

    <label class="search-wrap">
      <span aria-hidden="true">🔍</span>
      <input v-model="query" type="search" :placeholder="`Search ${notePosts.length} notes...`" />
    </label>

    <div v-if="activeTag !== 'all'" class="active-topic">
      <span>Topic: {{ activeTag }}</span>
      <button type="button" class="clear-topic-btn" @click="activeTag = 'all'">Clear</button>
    </div>

    <section class="archive-body" aria-live="polite">
      <p v-if="loading" class="empty-hint">正在加载笔记...</p>
      <p v-else-if="yearGroups.length === 0" class="empty-hint">当前还没有 Notes，先去写一篇吧。</p>

      <div v-for="group in yearGroups" :key="group.year" class="year-group">
        <div class="year-head">
          <h2>{{ group.year }}</h2>
          <span class="year-badge">{{ formatPostCount(group.posts.length) }}</span>
        </div>

        <ul class="post-list">
          <li v-for="post in group.posts" :key="post.slug" class="post-row">
            <time :datetime="post.date" class="post-date">{{ formatDate(post.date) }}</time>
            <div class="post-main">
              <RouterLink :to="`/article/${post.slug}`" class="post-link">{{ post.title }}</RouterLink>
              <div class="post-meta">
                <span v-if="post.updated" class="updated-at">更新于 {{ formatDate(post.updated) }}</span>
                <span v-if="post.pattern" class="tag-pill tag-pill-pattern">{{ post.pattern }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadAllPosts, type PostMeta } from '@/utils/markdown'

type YearGroup = {
  year: string
  posts: PostMeta[]
}

const loading = ref(true)
const query = ref('')
const activeTag = ref('all')
const posts = ref<PostMeta[]>([])
const route = useRoute()
const router = useRouter()

const notePosts = computed(() => posts.value.filter((post) => post.type === 'note'))
const availableTags = computed(() => {
  const map = new Map<string, number>()

  notePosts.value.forEach((post) => {
    post.tags.forEach((tag) => {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    })
  })

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const filteredPosts = computed(() => {
  const source =
    activeTag.value === 'all' ? notePosts.value : notePosts.value.filter((post) => post.tags.includes(activeTag.value))

  const keyword = query.value.trim().toLowerCase()
  if (!keyword) {
    return source
  }

  return source.filter((post) => {
    const haystack = [post.title, post.excerpt, post.tags.join(' ')].join(' ').toLowerCase()
    return haystack.includes(keyword)
  })
})

const yearGroups = computed<YearGroup[]>(() => {
  const map = new Map<string, PostMeta[]>()

  filteredPosts.value.forEach((post) => {
    const year = post.date.slice(0, 4) || 'Unknown'
    if (!map.has(year)) {
      map.set(year, [])
    }

    map.get(year)?.push(post)
  })

  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, groupedPosts]) => ({ year, posts: groupedPosts }))
})

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

const formatPostCount = (count: number): string => {
  return `${count} post${count > 1 ? 's' : ''}`
}

const readTagFromRoute = (): string => {
  const rawTag = route.query.tag
  return typeof rawTag === 'string' && rawTag.trim() ? rawTag.trim() : 'all'
}

const syncTagToRoute = async (tag: string): Promise<void> => {
  const currentTag = typeof route.query.tag === 'string' ? route.query.tag : undefined
  const normalized = tag === 'all' ? undefined : tag

  if (currentTag === normalized) {
    return
  }

  const nextQuery = { ...route.query } as Record<string, string | string[] | undefined>
  if (normalized) {
    nextQuery.tag = normalized
  } else {
    delete nextQuery.tag
  }

  await router.replace({ query: nextQuery })
}

watch(
  () => route.query.tag,
  () => {
    const routeTag = readTagFromRoute()
    if (activeTag.value !== routeTag) {
      activeTag.value = routeTag
    }
  }
)

watch(activeTag, (tag) => {
  void syncTagToRoute(tag)
})

watch(availableTags, (groups) => {
  if (activeTag.value === 'all') {
    return
  }

  const hasTag = groups.some((group) => group.name === activeTag.value)
  if (!hasTag) {
    activeTag.value = 'all'
  }
})

onMounted(async () => {
  posts.value = await loadAllPosts()
  activeTag.value = readTagFromRoute()
  loading.value = false
})
</script>

<style scoped>
.archive-page {
  max-width: 980px;
}

.archive-head h1 {
  margin: 0;
  font-size: clamp(36px, 4.2vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.archive-head h1 span {
  margin-right: 10px;
  font-size: 0.8em;
}

.archive-head p {
  margin: 20px 0 0;
  max-width: 860px;
  font-size: clamp(14px, 1.35vw, 18px);
  line-height: 1.5;
  color: var(--muted-strong);
}

.archive-head p :deep(a) {
  font-weight: 700;
  text-decoration: none;
}

.archive-head p :deep(a:hover) {
  text-decoration: underline;
}

.search-wrap {
  margin-top: 28px;
  width: min(100%, 420px);
  height: 46px;
  border-radius: 10px;
  border: 2px solid var(--line);
  background: var(--card);
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-wrap span {
  font-size: 20px;
}

.search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 16px;
  font-family: inherit;
}

.search-wrap input:focus {
  outline: none;
}

.active-topic {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-soft);
  padding: 6px 12px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.clear-topic-btn {
  border: none;
  background: transparent;
  color: var(--link);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.archive-body {
  margin-top: 48px;
}

.empty-hint {
  margin: 0;
  color: var(--muted);
  font-size: 16px;
}

.year-group + .year-group {
  margin-top: 44px;
}

.year-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.year-head h2 {
  margin: 0;
  font-size: clamp(28px, 3.1vw, 40px);
  line-height: 1;
  letter-spacing: -0.03em;
}

.year-badge {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 14px;
  color: var(--muted);
}

.post-list {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.post-row {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  align-items: baseline;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.post-date {
  color: var(--muted);
  font-size: 15px;
}

.post-link {
  color: var(--link);
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 700;
  text-decoration: none;
  line-height: 1.3;
}

.post-link:hover {
  text-decoration: underline;
}

.post-main {
  min-width: 0;
}

.post-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.updated-at {
  color: var(--muted);
  font-size: 13px;
}

.tag-pill {
  height: 24px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-soft);
  color: var(--muted);
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.tag-pill-pattern {
  border-color: var(--line);
  background: var(--panel);
  color: var(--muted);
}

@media (max-width: 960px) {
  .archive-head p {
    font-size: 16px;
  }

  .search-wrap {
    margin-top: 18px;
    height: 46px;
  }

  .search-wrap input,
  .year-badge,
  .post-date {
    font-size: 14px;
  }

  .updated-at {
    font-size: 12px;
  }

  .post-row {
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 12px;
  }

  .post-link {
    font-size: 16px;
  }
}
</style>
