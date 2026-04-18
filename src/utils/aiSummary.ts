export type AiSummaryResult = {
  summary: string
  bullets: string[]
  keywords: string[]
}

type SummaryInput = {
  title: string
  content: string
  tags: string[]
}

type ProxyResponse = Partial<AiSummaryResult>

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>
    }
  }>
}

const DEFAULT_MODEL = 'gpt-4o-mini'

const normalizeText = (input: unknown): string => {
  if (typeof input !== 'string') {
    return ''
  }

  return input.trim()
}

const normalizeArray = (input: unknown, max = 6): string[] => {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, max)
}

const toResult = (input: Partial<AiSummaryResult>): AiSummaryResult => {
  const summary = normalizeText(input.summary)
  const bullets = normalizeArray(input.bullets)
  const keywords = normalizeArray(input.keywords, 8)

  return {
    summary: summary || '暂无摘要，请稍后重试。',
    bullets,
    keywords
  }
}

const parseJsonObject = (content: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(content)
  } catch {
    const matched = content.match(/\{[\s\S]*\}/)
    if (!matched) {
      return null
    }

    try {
      return JSON.parse(matched[0])
    } catch {
      return null
    }
  }
}

const extractErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `AI 模型请求失败 (${response.status})`

  try {
    const text = (await response.text()).trim()
    if (!text) {
      return fallback
    }

    const parsed = parseJsonObject(text)
    if (!parsed) {
      return `${fallback}: ${text}`
    }

    const errorObj = parsed.error as Record<string, unknown> | undefined
    const message =
      normalizeText(errorObj?.message) || normalizeText(parsed.message) || normalizeText(parsed.code)

    return message ? `${fallback}: ${message}` : fallback
  } catch {
    return fallback
  }
}

const getMessageContent = (payload: OpenAIChatResponse): string => {
  const messageContent = payload.choices?.[0]?.message?.content

  if (typeof messageContent === 'string') {
    return messageContent
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((item) => (item?.type === 'text' ? normalizeText(item.text) : ''))
      .join('\n')
      .trim()
  }

  return ''
}

const summarizeByProxy = async (endpoint: string, input: SummaryInput): Promise<AiSummaryResult> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response))
  }

  const data = (await response.json()) as ProxyResponse
  return toResult(data)
}

const summarizeByOpenAICompat = async (input: SummaryInput): Promise<AiSummaryResult> => {
  const baseUrl = normalizeText(import.meta.env.VITE_AI_BASE_URL) || 'https://api.openai.com/v1'
  const model = normalizeText(import.meta.env.VITE_AI_MODEL) || DEFAULT_MODEL
  const apiKey = normalizeText(import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY)

  if (!apiKey) {
    throw new Error('未配置 AI API Key。请设置 VITE_AI_API_KEY 或 VITE_OPENAI_API_KEY。')
  }

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '你是博客阅读助手。请输出 JSON：{"summary":"...","bullets":["..."],"keywords":["..."]}。bullets 3-5 条，keywords 3-6 个。'
        },
        {
          role: 'user',
          content: `标题：${input.title}\n标签：${input.tags.join(', ')}\n正文：\n${input.content}`
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response))
  }

  const data = (await response.json()) as OpenAIChatResponse
  const content = getMessageContent(data)

  if (!content) {
    throw new Error('AI 返回为空，请重试。')
  }

  const parsed = parseJsonObject(content)
  if (!parsed) {
    return toResult({
      summary: content,
      bullets: [],
      keywords: []
    })
  }

  return toResult(parsed as Partial<AiSummaryResult>)
}

export const summarizeArticle = async (input: SummaryInput): Promise<AiSummaryResult> => {
  const proxyEndpoint = normalizeText(import.meta.env.VITE_AI_SUMMARY_ENDPOINT)

  if (proxyEndpoint) {
    return summarizeByProxy(proxyEndpoint, input)
  }

  return summarizeByOpenAICompat(input)
}
