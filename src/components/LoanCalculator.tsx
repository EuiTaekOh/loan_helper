import { useState } from 'react'
import {
  calculateRepayment,
  calculateSavingsMaturity,
  type LoanResult,
  type SavingsInterestType,
  type SavingsResult,
} from '../lib/finance'
import { formatWon } from '../lib/format'
import {
  hasFormErrors,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
  validateLoanForm,
  validateSavingsForm,
  type LoanFormErrors,
} from '../lib/loanForm'

interface LoanCalculatorProps {
  result: LoanResult | null
  onCalculated: (result: LoanResult) => void
  onClearResult: () => void
}

type CalculatorTab = 'loan' | 'savings'

function LoanCalculator({ result, onCalculated, onClearResult }: LoanCalculatorProps) {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('loan')

  const [principal, setPrincipal] = useState('10000000')
  const [annualRate, setAnnualRate] = useState('4.5')
  const [months, setMonths] = useState('60')
  const [errors, setErrors] = useState<LoanFormErrors>({})

  const [savingsPrincipal, setSavingsPrincipal] = useState('10000000')
  const [savingsAnnualRate, setSavingsAnnualRate] = useState('3.2')
  const [savingsMonths, setSavingsMonths] = useState('12')
  const [interestType, setInterestType] = useState<SavingsInterestType>('simple')
  const [savingsErrors, setSavingsErrors] = useState<LoanFormErrors>({})
  const [savingsResult, setSavingsResult] = useState<SavingsResult | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateLoanForm({ principal, annualRate, months })
    if (hasFormErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    try {
      const nextResult = calculateRepayment({
        principal: Number(principal),
        annualRate: Number(annualRate),
        months: Number(months),
      })
      setErrors({})
      onCalculated(nextResult)
    } catch (error) {
      const message = error instanceof Error ? error.message : '계산 중 오류가 발생했어요.'
      setErrors({ common: message })
    }
  }

  const handleSavingsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateSavingsForm({
      principal: savingsPrincipal,
      annualRate: savingsAnnualRate,
      months: savingsMonths,
    })
    if (hasFormErrors(validationErrors)) {
      setSavingsErrors(validationErrors)
      return
    }

    try {
      const nextResult = calculateSavingsMaturity({
        principal: Number(savingsPrincipal),
        annualRate: Number(savingsAnnualRate),
        months: Number(savingsMonths),
        interestType,
      })
      setSavingsErrors({})
      setSavingsResult(nextResult)
    } catch (error) {
      const message = error instanceof Error ? error.message : '계산 중 오류가 발생했어요.'
      setSavingsErrors({ common: message })
    }
  }

  return (
    <div>
      <h2 className="toss-title">금융 계산기</h2>

      <div className="toss-segmented mt-4">
        <button
          type="button"
          onClick={() => setActiveTab('loan')}
          className={`toss-segmented-item ${activeTab === 'loan' ? 'toss-segmented-item-active' : ''}`}
        >
          대출 상환
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('savings')
            onClearResult()
          }}
          className={`toss-segmented-item ${activeTab === 'savings' ? 'toss-segmented-item-active' : ''}`}
        >
          예·적금 만기
        </button>
      </div>

      {activeTab === 'loan' ? (
        <>
          <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2">
              <span className="toss-label">대출원금</span>
              <input
                type="text"
                inputMode="numeric"
                value={principal}
                onChange={(event) => setPrincipal(sanitizeIntegerInput(event.target.value))}
                className="toss-input tabular-nums"
                placeholder="예: 10000000"
              />
              {errors.principal ? <span className="toss-error">{errors.principal}</span> : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="toss-label">연 이자율(%)</span>
              <input
                type="text"
                inputMode="decimal"
                value={annualRate}
                onChange={(event) => setAnnualRate(sanitizeDecimalInput(event.target.value))}
                className="toss-input tabular-nums"
                placeholder="예: 4.5"
              />
              {errors.annualRate ? <span className="toss-error">{errors.annualRate}</span> : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="toss-label">상환기간(개월)</span>
              <input
                type="text"
                inputMode="numeric"
                value={months}
                onChange={(event) => setMonths(sanitizeIntegerInput(event.target.value))}
                className="toss-input tabular-nums"
                placeholder="예: 60"
              />
              {errors.months ? <span className="toss-error">{errors.months}</span> : null}
            </label>

            <div className="md:col-span-3">
              <button type="submit" className="toss-btn-primary w-full">
                상환 스케줄 계산하기
              </button>
            </div>

            {errors.common ? <p className="toss-error-box md:col-span-3">{errors.common}</p> : null}
          </form>

          {result ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="toss-stat-card">
                <p className="toss-stat-label">월 상환액</p>
                <p className="toss-stat-value">{formatWon(result.monthlyPayment)}</p>
              </div>
              <div className="toss-stat-card">
                <p className="toss-stat-label">총 상환액</p>
                <p className="toss-stat-value">{formatWon(result.totalPayment)}</p>
              </div>
              <div className="toss-stat-card">
                <p className="toss-stat-label">총 이자</p>
                <p className="toss-stat-value">{formatWon(result.totalInterest)}</p>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={handleSavingsSubmit} noValidate>
          <label className="flex flex-col gap-2">
            <span className="toss-label">원금</span>
            <input
              type="text"
              inputMode="numeric"
              value={savingsPrincipal}
              onChange={(event) => setSavingsPrincipal(sanitizeIntegerInput(event.target.value))}
              className="toss-input tabular-nums"
              placeholder="예: 10000000"
            />
            {savingsErrors.principal ? (
              <span className="toss-error">{savingsErrors.principal}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="toss-label">연 이자율(%)</span>
            <input
              type="text"
              inputMode="decimal"
              value={savingsAnnualRate}
              onChange={(event) => setSavingsAnnualRate(sanitizeDecimalInput(event.target.value))}
              className="toss-input tabular-nums"
              placeholder="예: 3.2"
            />
            {savingsErrors.annualRate ? (
              <span className="toss-error">{savingsErrors.annualRate}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="toss-label">가입기간(개월)</span>
            <input
              type="text"
              inputMode="numeric"
              value={savingsMonths}
              onChange={(event) => setSavingsMonths(sanitizeIntegerInput(event.target.value))}
              className="toss-input tabular-nums"
              placeholder="예: 12"
            />
            {savingsErrors.months ? <span className="toss-error">{savingsErrors.months}</span> : null}
          </label>

          <div className="md:col-span-3">
            <p className="toss-label">이자 방식</p>
            <div className="toss-segmented mt-2 max-w-md">
              <button
                type="button"
                onClick={() => setInterestType('simple')}
                className={`toss-segmented-item ${interestType === 'simple' ? 'toss-segmented-item-active' : ''}`}
              >
                단리
              </button>
              <button
                type="button"
                onClick={() => setInterestType('compound')}
                className={`toss-segmented-item ${interestType === 'compound' ? 'toss-segmented-item-active' : ''}`}
              >
                복리(월복리)
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <button type="submit" className="toss-btn-primary w-full">
              만기 금액 계산하기
            </button>
          </div>

          {savingsErrors.common ? (
            <p className="toss-error-box md:col-span-3">{savingsErrors.common}</p>
          ) : null}

          {savingsResult ? (
            <div className="grid grid-cols-1 gap-3 md:col-span-3 sm:grid-cols-2">
              <div className="toss-stat-card">
                <p className="toss-stat-label">만기 예상 금액</p>
                <p className="toss-stat-value">{formatWon(savingsResult.maturityAmount)}</p>
              </div>
              <div className="toss-stat-card">
                <p className="toss-stat-label">예상 이자 수익</p>
                <p className="toss-stat-value">{formatWon(savingsResult.interestAmount)}</p>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </div>
  )
}

export default LoanCalculator
