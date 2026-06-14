export interface LoanInput {
  principal: number
  annualRate: number
  months: number
}

export interface RepaymentRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: RepaymentRow[]
}

export type SavingsInterestType = 'simple' | 'compound'

export interface SavingsInput {
  principal: number
  annualRate: number
  months: number
  interestType: SavingsInterestType
}

export interface SavingsResult {
  maturityAmount: number
  interestAmount: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/** 월 상환액 — 원 단위 정수(반올림) */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  return Math.round(
    calculateRepayment({ principal, annualRate, months }).monthlyPayment,
  )
}

export function calculateRepayment(input: LoanInput): LoanResult {
  const { principal, annualRate, months } = input

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error('대출원금은 0보다 큰 숫자여야 합니다.')
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    throw new Error('연 이자율은 0 이상의 숫자여야 합니다.')
  }

  if (!Number.isInteger(months) || months <= 0) {
    throw new Error('상환기간(개월)은 1 이상의 정수여야 합니다.')
  }

  const monthlyRate = annualRate / 100 / 12
  const pow = Math.pow(1 + monthlyRate, months)

  const baseMonthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * pow) / (pow - 1)

  let balance = principal
  let totalPayment = 0
  let totalInterest = 0
  const schedule: RepaymentRow[] = []

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate
    let principalPayment = baseMonthlyPayment - interest
    let payment = baseMonthlyPayment

    if (month === months) {
      principalPayment = balance
      payment = principalPayment + interest
    }

    balance -= principalPayment
    if (Math.abs(balance) < 0.000001) {
      balance = 0
    }

    totalPayment += payment
    totalInterest += interest

    schedule.push({
      month,
      payment: round2(payment),
      principal: round2(principalPayment),
      interest: round2(interest),
      balance: round2(balance),
    })
  }

  return {
    monthlyPayment: round2(baseMonthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    schedule,
  }
}

export function calculateSavingsMaturity(input: SavingsInput): SavingsResult {
  const { principal, annualRate, months, interestType } = input

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error('예·적금 원금은 0보다 큰 숫자여야 합니다.')
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    throw new Error('연 이자율은 0 이상의 숫자여야 합니다.')
  }

  if (!Number.isInteger(months) || months <= 0) {
    throw new Error('가입기간(개월)은 1 이상의 정수여야 합니다.')
  }

  if (interestType !== 'simple' && interestType !== 'compound') {
    throw new Error('이자 계산 방식이 올바르지 않습니다.')
  }

  const annualRateDecimal = annualRate / 100
  const years = months / 12

  const maturityAmount =
    interestType === 'simple'
      ? principal * (1 + annualRateDecimal * years)
      : principal * Math.pow(1 + annualRateDecimal / 12, months)

  const interestAmount = maturityAmount - principal

  return {
    maturityAmount: round2(maturityAmount),
    interestAmount: round2(interestAmount),
  }
}
