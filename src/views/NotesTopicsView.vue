<template>
  <section class="topics-page">
    <header class="topics-head">
      <h1><span aria-hidden="true">🏷️</span> Topics</h1>
      <p>
        所有笔记主题，按拼音首字母分组。
        <RouterLink to="/notes">Back to notes.</RouterLink>
      </p>
    </header>

    <section class="topics-body" aria-live="polite">
      <p v-if="loading" class="empty-hint">正在整理 topics...</p>
      <p v-else-if="topicGroups.length === 0" class="empty-hint">当前还没有可用 topics。</p>

      <template v-else>
        <nav class="topic-index" aria-label="Topics index">
          <a v-for="letter in indexLetters" :key="`index-${letter}`" :href="`#topic-${letter}`">{{ letter }}</a>
        </nav>

        <section
          v-for="group in topicGroups"
          :id="`topic-${group.initial}`"
          :key="`group-${group.initial}`"
          class="topic-group"
        >
          <h2>{{ group.initial }}</h2>
          <div class="topic-grid">
            <RouterLink
              v-for="topic in group.topics"
              :key="`${group.initial}-${topic.name}`"
              :to="{ path: '/notes', query: { tag: topic.name } }"
              class="topic-card"
            >
              <strong>{{ topic.name }}</strong>
              <span>{{ formatPostCount(topic.count) }}</span>
            </RouterLink>
          </div>
        </section>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadAllPosts, type PostMeta } from '@/utils/markdown'

type TopicItem = {
  name: string
  count: number
}

type TopicGroup = {
  initial: string
  topics: TopicItem[]
}

const LETTER_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const PY_BOUNDARIES: ReadonlyArray<{ initial: string; boundary: string }> = [
  { initial: 'A', boundary: '阿' },
  { initial: 'B', boundary: '八' },
  { initial: 'C', boundary: '嚓' },
  { initial: 'D', boundary: '搭' },
  { initial: 'E', boundary: '蛾' },
  { initial: 'F', boundary: '发' },
  { initial: 'G', boundary: '噶' },
  { initial: 'H', boundary: '哈' },
  { initial: 'J', boundary: '击' },
  { initial: 'K', boundary: '喀' },
  { initial: 'L', boundary: '垃' },
  { initial: 'M', boundary: '妈' },
  { initial: 'N', boundary: '拿' },
  { initial: 'O', boundary: '哦' },
  { initial: 'P', boundary: '啪' },
  { initial: 'Q', boundary: '期' },
  { initial: 'R', boundary: '然' },
  { initial: 'S', boundary: '撒' },
  { initial: 'T', boundary: '塌' },
  { initial: 'W', boundary: '挖' },
  { initial: 'X', boundary: '昔' },
  { initial: 'Y', boundary: '压' },
  { initial: 'Z', boundary: '匝' }
]
const pinyinCollator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', { sensitivity: 'base', numeric: true })

const loading = ref(true)
const posts = ref<PostMeta[]>([])

const notePosts = computed(() => posts.value.filter((post) => post.type === 'note'))

const normalizeTopic = (value: string): string => value.normalize('NFKC').trim()

const getInitial = (topic: string): string => {
  const normalized = normalizeTopic(topic)
  const first = normalized.charAt(0)

  if (!first) {
    return '#'
  }

  if (/^[A-Za-z]$/.test(first)) {
    return first.toUpperCase()
  }

  if (/^[0-9]$/.test(first)) {
    return '#'
  }

  for (let index = 0; index < PY_BOUNDARIES.length; index += 1) {
    const current = PY_BOUNDARIES[index]
    const next = PY_BOUNDARIES[index + 1]
    const geCurrent = pinyinCollator.compare(first, current.boundary) >= 0
    const ltNext = !next || pinyinCollator.compare(first, next.boundary) < 0

    if (geCurrent && ltNext) {
      return current.initial
    }
  }

  return '#'
}

const topics = computed<TopicItem[]>(() => {
  const topicMap = new Map<string, number>()

  notePosts.value.forEach((post) => {
    post.tags.forEach((tag) => {
      const topic = normalizeTopic(tag)
      if (!topic) {
        return
      }

      topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1)
    })
  })

  return Array.from(topicMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => pinyinCollator.compare(a.name, b.name))
})

const topicGroups = computed<TopicGroup[]>(() => {
  const grouped = new Map<string, TopicItem[]>()

  topics.value.forEach((topic) => {
    const initial = getInitial(topic.name)
    if (!grouped.has(initial)) {
      grouped.set(initial, [])
    }

    grouped.get(initial)?.push(topic)
  })

  return [...LETTER_ORDER, '#']
    .map((letter) => ({
      initial: letter,
      topics: grouped.get(letter) ?? []
    }))
    .filter((group) => group.topics.length > 0)
})

const indexLetters = computed(() => topicGroups.value.map((group) => group.initial))

const formatPostCount = (count: number): string => `${count} post${count > 1 ? 's' : ''}`

onMounted(async () => {
  posts.value = await loadAllPosts()
  loading.value = false
})
</script>

<style scoped>
.topics-page {
  max-width: 980px;
}

.topics-head h1 {
  margin: 0;
  font-size: clamp(36px, 4.2vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.topics-head h1 span {
  margin-right: 10px;
  font-size: 0.8em;
}

.topics-head p {
  margin: 20px 0 0;
  max-width: 860px;
  font-size: clamp(14px, 1.35vw, 18px);
  line-height: 1.5;
  color: var(--muted-strong);
}

.topics-head p :deep(a) {
  font-weight: 700;
  text-decoration: none;
}

.topics-head p :deep(a:hover) {
  text-decoration: underline;
}

.topics-body {
  margin-top: 30px;
}

.empty-hint {
  margin: 0;
  color: var(--muted);
  font-size: 16px;
}

.topic-index {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-index a {
  width: 32px;
  height: 32px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel-soft);
  color: var(--muted);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.topic-group {
  margin-top: 26px;
}

.topic-group h2 {
  margin: 0;
  font-size: clamp(24px, 2.8vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.topic-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.topic-card {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  text-decoration: none;
  padding: 12px;
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.topic-card strong {
  font-size: 16px;
  line-height: 1.3;
  color: var(--link);
}

.topic-card span {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.topic-card:hover {
  border-color: var(--link);
  background: var(--panel-soft);
}

@media (max-width: 1100px) {
  .topic-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .topics-head p {
    font-size: 16px;
  }

  .topic-grid {
    grid-template-columns: 1fr;
  }

  .topic-card strong {
    font-size: 15px;
  }
}
</style>
