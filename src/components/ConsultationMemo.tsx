import { useMemo, useState } from 'react'
import {
  addMemo,
  deleteMemo,
  loadMemos,
  searchMemos,
  type ConsultationMemoItem,
} from '../lib/storage'

function ConsultationMemo() {
  const [memos, setMemos] = useState<ConsultationMemoItem[]>(() => loadMemos())
  const [newMemo, setNewMemo] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const filteredMemos = useMemo(() => searchMemos(memos, query), [memos, query])

  const handleAddMemo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const updated = addMemo(newMemo)
      setMemos(updated)
      setNewMemo('')
      setError('')
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : '메모를 저장하지 못했어요.'
      setError(message)
    }
  }

  const handleDeleteMemo = (id: string) => {
    const updated = deleteMemo(id)
    setMemos(updated)
  }

  const formatDateTime = (value: string): string => {
    const date = new Date(value)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div>
      <h2 className="toss-title">상담 메모</h2>

      <form className="mt-6 space-y-3" onSubmit={handleAddMemo}>
        <textarea
          value={newMemo}
          onChange={(event) => setNewMemo(event.target.value)}
          className="toss-textarea"
          placeholder="상담 주요 내용, 고객 요청사항 등을 입력해 주세요."
        />
        <button type="submit" className="toss-btn-primary w-full">
          메모 추가하기
        </button>
      </form>

      {error ? <p className="toss-error-box mt-4">{error}</p> : null}

      <div className="mt-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="toss-input"
          placeholder="메모 검색"
        />
      </div>

      <ul className="mt-4 space-y-3">
        {filteredMemos.length === 0 ? (
          <li className="rounded-toss-m bg-toss-grey-100 px-4 py-6 text-center text-[15px] text-toss-grey-600">
            {memos.length === 0
              ? '저장된 메모가 없어요. 첫 번째 메모를 추가해 보세요.'
              : '검색 결과가 없어요.'}
          </li>
        ) : (
          filteredMemos.map((memo) => (
            <li
              key={memo.id}
              className="rounded-toss-xl border border-toss-grey-200 bg-white p-4 shadow-toss-1"
            >
              <p className="whitespace-pre-wrap text-[15px] leading-[1.5] text-toss-grey-800">
                {memo.content}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[12px] text-toss-grey-500">{formatDateTime(memo.createdAt)}</span>
                <button type="button" onClick={() => handleDeleteMemo(memo.id)} className="toss-btn-ghost">
                  삭제
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default ConsultationMemo
