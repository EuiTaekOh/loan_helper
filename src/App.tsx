import { useEffect, useState } from 'react'
import ConsultationMemo from './components/ConsultationMemo'
import LoanCalculator from './components/LoanCalculator'
import RepaymentTable from './components/RepaymentTable'
import { type LoanResult } from './lib/finance'

const DARK_MODE_KEY = 'kb-loan-dark-mode'

function readStoredDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_MODE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function App() {
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null)
  const [darkMode, setDarkMode] = useState(() => readStoredDarkMode())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  }, [darkMode])

  return (
    <div className="min-h-screen bg-toss-grey-50 text-toss-grey-900 transition-colors duration-200 ease-toss dark:bg-toss-grey-900 dark:text-toss-grey-50">
      <header className="border-b border-toss-grey-200 bg-white transition-colors duration-200 ease-toss dark:border-toss-grey-700 dark:bg-toss-grey-800">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-6 py-6">
          <div>
            <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-toss-grey-900 dark:text-toss-grey-50">
              KB 여신 상담 도우미
            </h1>
            <p className="mt-1 text-[15px] leading-[1.5] text-toss-grey-700 dark:text-toss-grey-300">
              대출 상환, 예·적금 만기 계산, 상담 메모를 한 화면에서 관리해요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="print-hidden toss-btn-secondary shrink-0"
            aria-pressed={darkMode}
            aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {darkMode ? '라이트 모드' : '다크 모드'}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-6">
        <section className="toss-card">
          <LoanCalculator
            result={loanResult}
            onCalculated={setLoanResult}
            onClearResult={() => setLoanResult(null)}
          />
        </section>

        <section className="toss-card">
          <ConsultationMemo />
        </section>

        <section className="toss-card">
          <RepaymentTable schedule={loanResult?.schedule ?? []} />
        </section>
      </main>
    </div>
  )
}

export default App
