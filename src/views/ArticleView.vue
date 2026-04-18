<template>
  <article class="article-page">
    <div class="article-layout">
      <div class="article-main">
        <header class="article-head">
          <p v-if="postDate" class="meta-date">{{ postDate }}</p>
          <h1>{{ postTitle }}</h1>

          <div v-if="postTags.length" class="tag-list" aria-label="标签">
            <span v-for="tag in postTags" :key="tag">{{ tag }}</span>
          </div>

          <div class="ai-assistant-row">
            <button type="button" class="ai-trigger-btn" @click="openAiAssistant">🤖 AI 助手总结</button>
          </div>
        </header>

        <p v-if="loading" class="status-hint">正在加载文章...</p>
        <p v-else-if="errorMessage" class="status-error">{{ errorMessage }}</p>

        <template v-else>
          <section id="section-summary" class="summary-block toc-target" aria-label="重点摘要">
            <h2>重点摘要</h2>
            <ul>
              <li v-for="point in summaryPoints" :key="point">{{ point }}</li>
            </ul>
          </section>

          <section
            v-if="introHtml"
            id="section-introduction"
            class="intro-section markdown-body toc-target"
            v-html="introHtml"
          ></section>

          <section
            v-for="section in renderedSections"
            :id="section.id"
            :key="section.id"
            class="content-section toc-target"
          >
            <h2>{{ section.title }}</h2>
            <div class="markdown-body" v-html="section.html"></div>
          </section>

          <section v-if="relatedArticlePosts.length || relatedProjectCards.length" class="related-block">
            <h2>关联内容</h2>

            <div v-if="relatedArticlePosts.length" class="related-group">
              <p class="related-label">相关文章</p>
              <ul class="related-list">
                <li v-for="post in relatedArticlePosts" :key="`related-post-${post.slug}`">
                  <RouterLink :to="`/article/${post.slug}`">{{ post.title }}</RouterLink>
                </li>
              </ul>
            </div>

            <div v-if="relatedProjectCards.length" class="related-group">
              <p class="related-label">相关项目</p>
              <ul class="related-list">
                <li v-for="project in relatedProjectCards" :key="`related-project-${project.name}`">
                  <a :href="project.sourceUrl" target="_blank" rel="noreferrer">{{ project.name }}</a>
                </li>
              </ul>
            </div>
          </section>

          <section class="article-links">
            <a v-if="postYuque" :href="postYuque" target="_blank" rel="noreferrer" class="detail-card">
              📘 详细笔记（语雀）
            </a>
            <p v-else class="detail-card detail-card-disabled">📘 详细笔记（语雀） · 待补充链接</p>
          </section>

          <footer v-if="postGithub" class="project-bar">
            <a :href="postGithub" target="_blank" rel="noreferrer">🐙 完整项目（GitHub）</a>
          </footer>
        </template>
      </div>

      <aside v-if="!loading && !errorMessage && tocItems.length" class="article-toc">
        <div class="toc-card">
          <h2>Table of Contents</h2>
          <nav aria-label="文章目录">
            <a
              v-for="item in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="toc-link"
              :class="{ 'toc-link-active': activeSectionId === item.id }"
              @click="handleTocClick"
            >
              {{ item.title }}
            </a>
          </nav>
        </div>
      </aside>
    </div>

    <AISummaryDialog
      :open="aiDialogOpen"
      :loading="aiLoading"
      :error="aiError"
      :result="aiResult"
      @close="aiDialogOpen = false"
      @retry="retryAiSummary"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import AISummaryDialog from '@/components/AISummaryDialog.vue'
import { summarizeArticle, type AiSummaryResult } from '@/utils/aiSummary'
import { fetchMarkdown, loadAllPosts, parseFrontmatter, type PostMeta } from '@/utils/markdown'
import { projectCards, type ProjectCard } from '@/data/projects'

const props = defineProps<{
  slug: string
}>()

type RenderedSection = {
  id: string
  title: string
  html: string
}

type RawSection = {
  title: string
  markdown: string
}

type TocItem = {
  id: string
  title: string
}

const postTitle = ref('加载中...')
const postDate = ref('')
const postTags = ref<string[]>([])
const postYuque = ref('')
const postGithub = ref('')
const summaryPoints = ref<string[]>([])
const introHtml = ref('')
const renderedSections = ref<RenderedSection[]>([])
const loading = ref(true)
const errorMessage = ref('')
const articleBodyMarkdown = ref('')

const aiDialogOpen = ref(false)
const aiLoading = ref(false)
const aiError = ref('')
const aiResult = ref<AiSummaryResult | null>(null)
const aiCache = new Map<string, AiSummaryResult>()
const relatedArticlePosts = ref<PostMeta[]>([])
const relatedProjectCards = ref<ProjectCard[]>([])

const activeSectionId = ref('')
const TOC_ACTIVE_OFFSET = 140
const TOC_BOTTOM_THRESHOLD = 2
let tocSectionElements: HTMLElement[] = []
let tocRafId: number | null = null
let tocListenersAttached = false

const tocItems = computed<TocItem[]>(() => {
  const items: TocItem[] = [{ id: 'section-summary', title: '重点摘要' }]

  if (introHtml.value) {
    items.push({ id: 'section-introduction', title: 'Introduction' })
  }

  items.push(...renderedSections.value.map((section) => ({ id: section.id, title: section.title })))
  return items
})

const markdownToSafeHtml = async (markdown: string): Promise<string> => {
  const parsedHtml = await marked.parse(markdown)
  return DOMPurify.sanitize(parsedHtml)
}

const slugify = (value: string): string => {
  const basic = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')

  return basic || 'section'
}

const buildUniqueSectionIds = (sections: RawSection[]): string[] => {
  const seen = new Map<string, number>()

  return sections.map((section, index) => {
    const fallbackId = `section-${index + 1}`
    const base = slugify(section.title) || fallbackId
    const count = seen.get(base) ?? 0

    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  })
}

const splitMarkdownSections = (body: string): { introMarkdown: string; sections: RawSection[] } => {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const introLines: string[] = []
  const sections: RawSection[] = []
  let current: RawSection | null = null

  lines.forEach((line) => {
    if (/^##\s+/.test(line)) {
      if (current) {
        current.markdown = current.markdown.trim()
        sections.push(current)
      }

      current = {
        title: line.replace(/^##\s+/, '').trim(),
        markdown: ''
      }
      return
    }

    if (current) {
      current.markdown += `${line}\n`
    } else {
      introLines.push(line)
    }
  })

  if (current) {
    current.markdown = current.markdown.trim()
    sections.push(current)
  }

  return {
    introMarkdown: introLines.join('\n').trim(),
    sections
  }
}

const createFallbackSummary = (body: string): string[] => {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/(^|\s)#{1,6}\s*/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  const candidates = plain
    .split(/[。！？.!?]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 12)

  if (candidates.length > 0) {
    return candidates.slice(0, 4)
  }

  if (plain) {
    return [plain.slice(0, 48)]
  }

  return ['暂无摘要']
}

const markdownToPlainText = (markdown: string): string => {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(^|\s)#{1,6}\s*/g, ' ')
    .replace(/[*_~>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const normalizeMetaStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const resolveRelatedContent = async (meta: Record<string, unknown>): Promise<void> => {
  const relatedArticleSlugs = normalizeMetaStringArray(meta.related_articles ?? meta.relatedArticles)
  const relatedProjectKeys = normalizeMetaStringArray(meta.related_projects ?? meta.relatedProjects).map((item) =>
    item.toLowerCase()
  )

  const allPosts = await loadAllPosts()
  const postMap = new Map(allPosts.map((post) => [post.slug, post]))

  relatedArticlePosts.value = relatedArticleSlugs
    .map((slug) => postMap.get(slug))
    .filter((post): post is PostMeta => Boolean(post))
    .filter((post) => post.slug !== props.slug)

  if (relatedArticlePosts.value.length === 0 && postTags.value.length > 0) {
    const currentTags = new Set(postTags.value.map((tag) => tag.toLowerCase()))

    relatedArticlePosts.value = allPosts
      .filter((post) => post.type === 'blog' && post.slug !== props.slug)
      .filter((post) => post.tags.some((tag) => currentTags.has(tag.toLowerCase())))
      .slice(0, 3)
  }

  relatedProjectCards.value = projectCards.filter((project) => {
    if (relatedProjectKeys.length === 0) {
      return false
    }

    const projectName = project.name.toLowerCase()
    const projectSource = project.sourceUrl.toLowerCase()
    const projectArticle = (project.articleUrl ?? '').toLowerCase()

    return relatedProjectKeys.some(
      (key) => projectName.includes(key) || projectSource.includes(key) || projectArticle.includes(key)
    )
  })

  if (relatedProjectCards.value.length === 0) {
    relatedProjectCards.value = projectCards.filter((project) => project.articleUrl === `/article/${props.slug}`)
  }
}

const cancelTocAnimationFrame = (): void => {
  if (tocRafId !== null) {
    window.cancelAnimationFrame(tocRafId)
    tocRafId = null
  }
}

const updateActiveSectionByScroll = (): void => {
  if (tocSectionElements.length === 0) {
    activeSectionId.value = ''
    return
  }

  const scrollBottom = window.scrollY + window.innerHeight
  const pageBottom = document.documentElement.scrollHeight
  if (scrollBottom >= pageBottom - TOC_BOTTOM_THRESHOLD) {
    activeSectionId.value = tocSectionElements[tocSectionElements.length - 1].id
    return
  }

  let currentSection = tocSectionElements[0]
  for (const section of tocSectionElements) {
    if (section.getBoundingClientRect().top <= TOC_ACTIVE_OFFSET) {
      currentSection = section
      continue
    }
    break
  }

  activeSectionId.value = currentSection.id
}

const scheduleTocUpdate = (): void => {
  cancelTocAnimationFrame()
  tocRafId = window.requestAnimationFrame(() => {
    tocRafId = null
    updateActiveSectionByScroll()
  })
}

const disconnectObserver = (): void => {
  if (tocListenersAttached) {
    window.removeEventListener('scroll', scheduleTocUpdate)
    window.removeEventListener('resize', scheduleTocUpdate)
    tocListenersAttached = false
  }

  cancelTocAnimationFrame()
  tocSectionElements = []
}

const setupTocObserver = async (): Promise<void> => {
  await nextTick()
  disconnectObserver()

  tocSectionElements = Array.from(document.querySelectorAll<HTMLElement>('.toc-target'))
  if (tocSectionElements.length === 0) {
    activeSectionId.value = ''
    return
  }

  window.addEventListener('scroll', scheduleTocUpdate, { passive: true })
  window.addEventListener('resize', scheduleTocUpdate)
  tocListenersAttached = true
  updateActiveSectionByScroll()
}

const handleTocClick = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLAnchorElement | null
  if (!target) {
    return
  }

  const href = target.getAttribute('href')
  if (!href || !href.startsWith('#')) {
    return
  }

  event.preventDefault()
  const id = href.slice(1)
  const element = document.getElementById(id)
  if (!element) {
    return
  }

  activeSectionId.value = id
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const resetAiState = (): void => {
  aiLoading.value = false
  aiError.value = ''
  aiResult.value = aiCache.get(props.slug) ?? null
}

const requestAiSummary = async (force = false): Promise<void> => {
  if (!force) {
    const cached = aiCache.get(props.slug)
    if (cached) {
      aiResult.value = cached
      aiError.value = ''
      aiLoading.value = false
      return
    }
  }

  aiLoading.value = true
  aiError.value = ''

  try {
    const plainContent = markdownToPlainText(articleBodyMarkdown.value).slice(0, 12000)
    const result = await summarizeArticle({
      title: postTitle.value,
      content: plainContent,
      tags: postTags.value
    })

    aiResult.value = result
    aiCache.set(props.slug, result)
  } catch (error) {
    aiError.value = error instanceof Error ? error.message : 'AI 摘要生成失败，请稍后重试。'
  } finally {
    aiLoading.value = false
  }
}

const openAiAssistant = async (): Promise<void> => {
  aiDialogOpen.value = true
  await requestAiSummary(false)
}

const retryAiSummary = async (): Promise<void> => {
  await requestAiSummary(true)
}

const loadArticle = async (): Promise<void> => {
  loading.value = true
  errorMessage.value = ''
  activeSectionId.value = ''
  disconnectObserver()
  relatedArticlePosts.value = []
  relatedProjectCards.value = []

  try {
    const markdown = await fetchMarkdown(props.slug)
    const { meta, body } = parseFrontmatter(markdown)
    articleBodyMarkdown.value = body

    postTitle.value = meta.title || props.slug
    postDate.value = meta.date || ''
    postTags.value = Array.isArray(meta.tags) ? meta.tags : []
    postYuque.value = typeof meta.yuque === 'string' ? meta.yuque : ''
    postGithub.value = typeof meta.github === 'string' ? meta.github : ''

    const frontSummary = Array.isArray(meta.summary)
      ? meta.summary.map((item) => String(item).trim()).filter(Boolean)
      : []
    summaryPoints.value = frontSummary.length > 0 ? frontSummary.slice(0, 5) : createFallbackSummary(body)

    const { introMarkdown, sections } = splitMarkdownSections(body)
    introHtml.value = introMarkdown ? await markdownToSafeHtml(introMarkdown) : ''

    if (sections.length === 0) {
      renderedSections.value = [
        {
          id: 'main-content',
          title: '关键内容',
          html: await markdownToSafeHtml(body)
        }
      ]
    } else {
      const sectionIds = buildUniqueSectionIds(sections)
      renderedSections.value = await Promise.all(
        sections.map(async (section, index) => ({
          id: sectionIds[index],
          title: section.title,
          html: await markdownToSafeHtml(section.markdown)
        }))
      )
    }

    await resolveRelatedContent(meta as Record<string, unknown>)

  } catch (error) {
    postTitle.value = '文章不存在'
    postDate.value = ''
    postTags.value = []
    summaryPoints.value = []
    postYuque.value = ''
    postGithub.value = ''
    articleBodyMarkdown.value = ''
    introHtml.value = ''
    renderedSections.value = []
    relatedArticlePosts.value = []
    relatedProjectCards.value = []
    activeSectionId.value = ''
    errorMessage.value = error instanceof Error ? error.message : '加载文章失败。'
    disconnectObserver()
  } finally {
    loading.value = false
    if (!errorMessage.value) {
      await setupTocObserver()
    }
  }
}

watch(
  () => props.slug,
  () => {
    aiDialogOpen.value = false
    resetAiState()
    void loadArticle()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  disconnectObserver()
})
</script>

<style scoped>
.article-page {
  max-width: 1220px;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 36px;
  align-items: start;
}

.article-main {
  min-width: 0;
}

.article-head h1 {
  margin: 6px 0 0;
  font-size: clamp(34px, 4.2vw, 52px);
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.meta-date {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.tag-list {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-list span {
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-soft);
  color: var(--muted);
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.ai-assistant-row {
  margin-top: 14px;
}

.ai-trigger-btn {
  min-height: 38px;
  border: 1px solid var(--line-strong);
  border-radius: 9px;
  background: var(--panel);
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  padding: 0 14px;
  cursor: pointer;
}

.ai-trigger-btn:hover {
  background: var(--panel-hover);
}

.status-hint,
.status-error {
  margin-top: 18px;
  font-size: 18px;
}

.status-hint {
  color: var(--muted);
}

.status-error {
  color: var(--danger);
}

.summary-block {
  margin-top: 24px;
  border: 2px solid var(--line-strong);
  border-radius: 10px;
  background: var(--panel);
  padding: 18px;
}

.summary-block h2 {
  margin: 0;
  font-size: clamp(24px, 2.6vw, 34px);
}

.summary-block ul {
  margin: 12px 0 0;
  padding-left: 26px;
}

.summary-block li {
  margin-bottom: 8px;
  font-size: clamp(15px, 1.2vw, 18px);
  line-height: 1.7;
}

.intro-section {
  margin-top: 22px;
}

.content-section {
  margin-top: 28px;
}

.content-section h2 {
  margin: 0;
  font-size: clamp(24px, 2.7vw, 34px);
  letter-spacing: -0.02em;
}

.markdown-body {
  margin-top: 12px;
  color: var(--muted-strong);
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.85;
}

.markdown-body :deep(p) {
  margin: 0 0 1em;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1em 1.2em;
}

.markdown-body :deep(code) {
  background: var(--panel-soft);
  border-radius: 5px;
  padding: 0.1em 0.35em;
  font-size: 0.88em;
}

.markdown-body :deep(pre) {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  padding: 10px;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.detail-card {
  margin-top: 0;
  display: flex;
  align-items: center;
  min-height: 50px;
  border: 2px solid var(--line-strong);
  border-radius: 10px;
  background: var(--panel);
  color: var(--link);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 0 14px;
}

.detail-card:hover {
  text-decoration: underline;
}

.detail-card-disabled {
  color: var(--muted);
}

.article-links {
  margin-top: 22px;
}

.related-block {
  margin-top: 28px;
  border: 2px solid var(--line-strong);
  border-radius: 10px;
  background: var(--panel);
  padding: 16px;
}

.related-block h2 {
  margin: 0;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.2;
}

.related-group + .related-group {
  margin-top: 12px;
}

.related-label {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.related-list {
  margin: 8px 0 0;
  padding-left: 1.2em;
}

.related-list li + li {
  margin-top: 6px;
}

.related-list a {
  color: var(--link);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.related-list a:hover {
  text-decoration: underline;
}

.project-bar {
  margin-top: 34px;
}

.project-bar a {
  min-height: 56px;
  border: 2px solid var(--line-strong);
  border-radius: 10px;
  background: var(--panel-soft);
  color: var(--text);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 1.2vw, 20px);
  font-weight: 800;
}

.project-bar a:hover {
  background: var(--panel-hover);
}

.article-toc {
  position: sticky;
  top: 24px;
}

.toc-card {
  border-left: 1px solid var(--line-strong);
  padding-left: 16px;
}

.toc-card h2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: var(--text);
}

.toc-card nav {
  margin-top: 12px;
  display: grid;
  gap: 6px;
}

.toc-link {
  border-left: 2px solid transparent;
  border-radius: 6px;
  color: var(--muted);
  display: block;
  margin-left: -6px;
  padding: 4px 8px;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.toc-link:hover {
  color: var(--link);
  background: var(--panel);
}

.toc-link-active {
  background: var(--panel);
  border-left-color: var(--link);
  color: var(--link);
  font-weight: 700;
}

@media (max-width: 1100px) {
  .article-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .article-toc {
    position: static;
  }

  .toc-card {
    border-left: none;
    border-top: 1px solid var(--line-strong);
    padding-left: 0;
    padding-top: 12px;
  }
}

@media (max-width: 960px) {
  .meta-date,
  .tag-list span,
  .summary-block li,
  .markdown-body,
  .detail-card {
    font-size: 14px;
  }

  .summary-block {
    margin-top: 16px;
    padding: 12px;
  }

  .summary-block ul {
    margin-top: 8px;
    padding-left: 20px;
  }

  .content-section,
  .project-bar {
    margin-top: 18px;
  }

  .related-list a {
    font-size: 14px;
  }
}
</style>
