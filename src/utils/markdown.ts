export type MarkdownMeta = {
  title: string
  date: string
  tags: string[]
  [key: string]: unknown
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
}

const markdownModules = import.meta.glob('../pages/*.md', {
  query: '?raw',
  import: 'default'
})

const stripQuotes = (value: string): string => {
  return value.replace(/^['\"]|['\"]$/g, '').trim()
}

const parseInlineTags = (value: string): string[] => {
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

const slugFromPath = (path: string): string => {
  const filename = path.split('/').pop() ?? ''
  return filename.replace(/\.md$/i, '')
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

const buildExcerpt = (body: string, maxLength = 110): string => {
  const normalized = stripMarkdownSyntax(body).replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength).trim()}...`
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

  if (!matched) {
    return {
      meta: { title: 'Untitled', date: '', tags: [] },
      body: normalizedContent.trim()
    }
  }

  const frontmatterBlock = matched[1]
  const bodyBlock = matched[2]
  const lines = frontmatterBlock.split(/\r?\n/)

  const meta: MarkdownMeta = {
    title: 'Untitled',
    date: '',
    tags: []
  }

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

    if (key === 'tags') {
      if (rawValue) {
        meta.tags = parseInlineTags(rawValue)
        continue
      }

      const tags: string[] = []
      let cursor = index + 1

      while (cursor < lines.length) {
        const tagLine = lines[cursor].trim()
        if (!tagLine.startsWith('- ')) {
          break
        }

        tags.push(stripQuotes(tagLine.slice(2)))
        cursor += 1
      }

      meta.tags = tags.filter(Boolean)
      index = cursor - 1
      continue
    }

    const value = stripQuotes(rawValue)

    if (key === 'title') {
      meta.title = value || 'Untitled'
      continue
    }

    if (key === 'date') {
      meta.date = value
      continue
    }

    meta[key] = value
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

      return {
        slug,
        title: meta.title,
        date: meta.date,
        tags: meta.tags,
        excerpt: buildExcerpt(body)
      }
    })
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}
