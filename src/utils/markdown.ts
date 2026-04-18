export type PostKind = 'blog' | 'note'

export type MarkdownMeta = {
  title: string
  date: string
  updated?: string
  tags: string[]
  type: PostKind
  summary: string[]
  related_articles?: string[]
  related_projects?: string[]
  relatedArticles?: string[]
  relatedProjects?: string[]
  pattern?: string
  yuque?: string
  github?: string
  excerpt?: string
  cover?: string
  [key: string]: unknown
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  updated?: string
  wordCount: number
  readingMinutes: number
  tags: string[]
  excerpt: string
  cover?: string
  type: PostKind
  summary: string[]
  relatedArticles: string[]
  relatedProjects: string[]
  pattern?: string
  yuque?: string
  github?: string
}

const markdownModules = import.meta.glob('../pages/*.md', {
  query: '?raw',
  import: 'default'
})

const assetModules = import.meta.glob<string>('../assets/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default'
})

const assetPathMap = new Map<string, string>()

Object.entries(assetModules).forEach(([path, url]) => {
  const normalizedPath = path.replace('../assets/', '')
  assetPathMap.set(normalizedPath, url)

  const filename = normalizedPath.split('/').pop()
  if (filename && !assetPathMap.has(filename)) {
    assetPathMap.set(filename, url)
  }
})

const slugFromPath = (path: string): string => {
  const filename = path.split('/').pop() ?? ''
  return filename.replace(/\.md$/i, '')
}

const stripQuotes = (value: string): string => {
  return value.replace(/^['"]|['"]$/g, '').trim()
}

const parseInlineArray = (value: string): string[] => {
  const cleaned = value.trim()

  if (!cleaned.startsWith('[') || !cleaned.endsWith(']')) {
    return cleaned ? [stripQuotes(cleaned)] : []
  }

  const inner = cleaned.slice(1, -1).trim()
  if (!inner) {
    return []
  }

  return inner
    .split(',')
    .map((item) => stripQuotes(item))
    .filter(Boolean)
}

const normalizeKind = (value: unknown): PostKind => {
  return value === 'note' ? 'note' : 'blog'
}

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return parseInlineArray(value)
  }

  return []
}

const normalizeOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim()
  return normalized || undefined
}

const stripMarkdownSyntax = (body: string): string => {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/(^|\s)#{1,6}\s*/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_~>|-]/g, ' ')
}

const toPlainText = (body: string): string => {
  return stripMarkdownSyntax(body).replace(/\s+/g, ' ').trim()
}

const buildExcerpt = (body: string, maxLength = 120): string => {
  const normalized = toPlainText(body)
  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength).trim()}...`
}

const estimateReading = (body: string): { wordCount: number; readingMinutes: number } => {
  const plain = toPlainText(body)
  if (!plain) {
    return { wordCount: 0, readingMinutes: 1 }
  }

  const cjkCount = (plain.match(/[\u3400-\u9fff]/g) ?? []).length
  const latinWordCount = (plain.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9_]+/g) ?? []).length
  const wordCount = cjkCount + latinWordCount
  const readingMinutes = Math.max(1, Math.ceil(cjkCount / 300 + latinWordCount / 200))

  return { wordCount, readingMinutes }
}

const resolveCoverUrl = (raw: unknown): string | undefined => {
  if (typeof raw !== 'string') {
    return undefined
  }

  const cover = raw.trim()
  if (!cover) {
    return undefined
  }

  if (/^(https?:)?\/\//i.test(cover) || cover.startsWith('/')) {
    return cover
  }

  const normalizedPath = cover.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^assets\//, '')
  return assetPathMap.get(normalizedPath)
}

export const fetchMarkdown = async (slug: string): Promise<string> => {
  const entry = Object.entries(markdownModules).find(([path]) => slugFromPath(path) === slug)

  if (!entry) {
    throw new Error(`Markdown not found for slug: ${slug}`)
  }

  const raw = await entry[1]()
  return typeof raw === 'string' ? raw : String(raw)
}

export const parseFrontmatter = (content: string): { meta: MarkdownMeta; body: string } => {
  const normalizedContent = content.replace(/^\uFEFF/, '')
  const matched = normalizedContent.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)

  const meta: MarkdownMeta = {
    title: 'Untitled',
    date: '',
    tags: [],
    type: 'blog',
    summary: []
  }

  if (!matched) {
    return {
      meta,
      body: normalizedContent.trim()
    }
  }

  const frontmatterBlock = matched[1]
  const bodyBlock = matched[2]
  const lines = frontmatterBlock.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index].trim()

    if (!rawLine || rawLine.startsWith('#')) {
      continue
    }

    const separatorIndex = rawLine.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = rawLine.slice(0, separatorIndex).trim()
    const rawValue = rawLine.slice(separatorIndex + 1).trim()

    if (!rawValue) {
      const listItems: string[] = []
      let cursor = index + 1

      while (cursor < lines.length) {
        const listLine = lines[cursor].trim()
        if (!listLine.startsWith('- ')) {
          break
        }

        listItems.push(stripQuotes(listLine.slice(2)))
        cursor += 1
      }

      if (listItems.length > 0) {
        meta[key] = listItems
        if (key === 'tags') {
          meta.tags = listItems
        }
        if (key === 'summary') {
          meta.summary = listItems
        }

        index = cursor - 1
      }

      continue
    }

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      const listItems = parseInlineArray(rawValue)
      meta[key] = listItems

      if (key === 'tags') {
        meta.tags = listItems
      }
      if (key === 'summary') {
        meta.summary = listItems
      }
      continue
    }

    const value = stripQuotes(rawValue)
    meta[key] = value

    if (key === 'title') {
      meta.title = value || 'Untitled'
    } else if (key === 'date') {
      meta.date = value
    }
  }

  meta.type = normalizeKind(meta.type)
  meta.tags = normalizeStringArray(meta.tags)
  meta.summary = normalizeStringArray(meta.summary)
  meta.related_articles = normalizeStringArray(meta.related_articles ?? meta.relatedArticles)
  meta.related_projects = normalizeStringArray(meta.related_projects ?? meta.relatedProjects)
  meta.updated = normalizeOptionalString(meta.updated)
  meta.pattern = normalizeOptionalString(meta.pattern)

  if (typeof meta.yuque !== 'string') {
    delete meta.yuque
  }

  if (typeof meta.github !== 'string') {
    delete meta.github
  }

  if (typeof meta.excerpt !== 'string') {
    delete meta.excerpt
  }

  return {
    meta,
    body: bodyBlock.trim()
  }
}

export const loadAllPosts = async (): Promise<PostMeta[]> => {
  const posts = await Promise.all(
    Object.keys(markdownModules).map(async (path) => {
      const slug = slugFromPath(path)
      const markdown = await fetchMarkdown(slug)
      const { meta, body } = parseFrontmatter(markdown)
      const reading = estimateReading(body)

      return {
        slug,
        title: meta.title,
        date: meta.date,
        updated: meta.updated || meta.date || undefined,
        wordCount: reading.wordCount,
        readingMinutes: reading.readingMinutes,
        tags: meta.tags,
        excerpt: typeof meta.excerpt === 'string' && meta.excerpt.trim() ? meta.excerpt.trim() : buildExcerpt(body),
        cover: resolveCoverUrl(meta.cover),
        type: meta.type,
        summary: meta.summary,
        relatedArticles: normalizeStringArray(meta.related_articles),
        relatedProjects: normalizeStringArray(meta.related_projects),
        pattern: meta.pattern,
        yuque: meta.yuque,
        github: meta.github
      }
    })
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}
