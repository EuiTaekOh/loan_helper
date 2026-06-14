import { useState } from 'react'
import ConsultationMemo from './components/ConsultationMemo'
import LoanCalculator from './components/LoanCalculator'
import RepaymentTable from './components/RepaymentTable'
import { type LoanResult } from './lib/finance'

function App() {
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null)

  return (
    <div className="min-h-screen bg-toss-grey-50 text-toss-grey-900">
      <header className="border-b border-toss-grey-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-6">
          <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-toss-grey-900">
            KB 여신 상담 도우미
          </h1>
          <p className="text-[15px] leading-[1.5] text-toss-grey-700">
            대출 상환, 예·적금 만기 계산, 상담 메모를 한 화면에서 관리해요
          </p>
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
