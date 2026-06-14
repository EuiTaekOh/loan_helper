const MEMO_KEY = 'kb-loan-consultation-memos'

export interface ConsultationMemoItem {
  id: string
  content: string
  createdAt: string
}

function persistMemos(memos: ConsultationMemoItem[]): void {
  localStorage.setItem(MEMO_KEY, JSON.stringify(memos))
}

export function loadMemos(): ConsultationMemoItem[] {
  const raw = localStorage.getItem(MEMO_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item): item is ConsultationMemoItem =>
        typeof item?.id === 'string' &&
        typeof item?.content === 'string' &&
        typeof item?.createdAt === 'string',
    )
  } catch {
    return []
  }
}

export function addMemo(content: string): ConsultationMemoItem[] {
  const trimmed = content.trim()
  if (!trimmed) {
    throw new Error('메모 내용을 입력하세요.')
  }

  const nextMemo: ConsultationMemoItem = {
    id: crypto.randomUUID(),
    content: trimmed,
    createdAt: new Date().toISOString(),
  }

  const current = loadMemos()
  const updated = [nextMemo, ...current]
  persistMemos(updated)
  return updated
}

export function deleteMemo(id: string): ConsultationMemoItem[] {
  const updated = loadMemos().filter((memo) => memo.id !== id)
  persistMemos(updated)
  return updated
}

export function searchMemos(
  memos: ConsultationMemoItem[],
  keyword: string,
): ConsultationMemoItem[] {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) {
    return memos
  }

  return memos.filter((memo) => memo.content.toLowerCase().includes(normalized))
}
