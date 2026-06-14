import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addMemo,
  deleteMemo,
  loadMemos,
  searchMemos,
  type ConsultationMemoItem,
} from './storage'

const MEMO_KEY = 'kb-loan-consultation-memos'

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

describe('상담 메모 — 동작 시나리오', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock())
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(
        () => `id-${Math.random().toString(36).slice(2, 9)}`,
      ),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('메모 2~3개 추가 시 목록에 즉시 표시된다', () => {
    let memos = addMemo('주택담보대출 상담')
    memos = addMemo('금리 인하 요청')
    memos = addMemo('서류 안내 완료')

    expect(memos).toHaveLength(3)
    expect(memos.map((m) => m.content)).toEqual([
      '서류 안내 완료',
      '금리 인하 요청',
      '주택담보대출 상담',
    ])
  })

  it('페이지 새로고침(localStorage) 후에도 메모가 유지된다', () => {
    addMemo('새로고침 테스트 메모')

    const reloaded = loadMemos()

    expect(reloaded).toHaveLength(1)
    expect(reloaded[0]?.content).toBe('새로고침 테스트 메모')
  })

  it('검색창 키워드로 포함된 메모만 필터링된다', () => {
    const memos: ConsultationMemoItem[] = [
      { id: '1', content: '주택담보대출 금리 문의', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: '2', content: '신용대출 한도 확인', createdAt: '2026-01-02T00:00:00.000Z' },
      { id: '3', content: '주택담보 서류 안내', createdAt: '2026-01-03T00:00:00.000Z' },
    ]

    const result = searchMemos(memos, '주택담보')

    expect(result).toHaveLength(2)
    expect(result.every((m) => m.content.includes('주택담보'))).toBe(true)
  })

  it('메모 삭제 후 새로고침해도 삭제 상태가 유지된다', () => {
    const memos = addMemo('삭제 대상 메모')
    const id = memos[0]!.id

    deleteMemo(id)
    const reloaded = loadMemos()

    expect(reloaded).toHaveLength(0)
  })

  it('빈 내용으로 추가 시도하면 추가되지 않고 안내 메시지를 던진다', () => {
    expect(() => addMemo('')).toThrow('메모 내용을 입력하세요.')
    expect(() => addMemo('   \n  ')).toThrow('메모 내용을 입력하세요.')
    expect(loadMemos()).toHaveLength(0)
  })
})

describe('상담 메모 — 예외·경계값', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock())
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'fixed-id'),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('검색어가 비어 있으면 전체 메모를 반환한다', () => {
    const memos: ConsultationMemoItem[] = [
      { id: '1', content: '메모 A', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: '2', content: '메모 B', createdAt: '2026-01-02T00:00:00.000Z' },
    ]

    expect(searchMemos(memos, '')).toHaveLength(2)
    expect(searchMemos(memos, '   ')).toHaveLength(2)
  })

  it('검색 결과가 없으면 빈 배열을 반환한다', () => {
    const memos: ConsultationMemoItem[] = [
      { id: '1', content: '신용대출', createdAt: '2026-01-01T00:00:00.000Z' },
    ]

    expect(searchMemos(memos, '주택')).toHaveLength(0)
  })

  it('검색은 대소문자를 구분하지 않는다', () => {
    const memos: ConsultationMemoItem[] = [
      { id: '1', content: 'KB Loan 상담', createdAt: '2026-01-01T00:00:00.000Z' },
    ]

    expect(searchMemos(memos, 'loan')).toHaveLength(1)
  })

  it('localStorage가 비어 있으면 빈 배열을 반환한다', () => {
    expect(loadMemos()).toEqual([])
  })

  it('localStorage JSON이 깨져 있으면 빈 배열을 반환한다', () => {
    localStorage.setItem(MEMO_KEY, '{ invalid json')
    expect(loadMemos()).toEqual([])
  })

  it('localStorage에 배열이 아닌 값이 있으면 빈 배열을 반환한다', () => {
    localStorage.setItem(MEMO_KEY, JSON.stringify({ foo: 'bar' }))
    expect(loadMemos()).toEqual([])
  })

  it('형식이 잘못된 항목은 loadMemos에서 제외한다', () => {
    localStorage.setItem(
      MEMO_KEY,
      JSON.stringify([
        { id: '1', content: '정상 메모', createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 2, content: '잘못된 id' },
        { content: 'id 없음', createdAt: '2026-01-01T00:00:00.000Z' },
      ]),
    )

    expect(loadMemos()).toHaveLength(1)
    expect(loadMemos()[0]?.content).toBe('정상 메모')
  })

  it('존재하지 않는 id 삭제 시 오류 없이 빈 목록을 유지한다', () => {
    addMemo('유지할 메모')
    const updated = deleteMemo('없는-id')

    expect(updated).toHaveLength(1)
    expect(loadMemos()).toHaveLength(1)
  })
})
