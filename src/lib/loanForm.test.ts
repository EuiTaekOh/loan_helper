import { describe, expect, it } from 'vitest'
import { calculateRepayment } from './finance'
import {
  sanitizeDecimalInput,
  sanitizeIntegerInput,
  validateLoanForm,
} from './loanForm'

const roundWon = (value: number): number => Math.round(value)

describe('예외·경계값 — 대출 상환 입력 검증', () => {
  it.each([
    { principal: '', label: '빈 값' },
    { principal: '0', label: '0' },
    { principal: '-1000000', label: '음수' },
    { principal: 'abc', label: '문자' },
    { principal: '1000@#$', label: '특수문자' },
  ])('대출금액 $label — 계산하지 않고 안내 메시지', ({ principal }) => {
    const errors = validateLoanForm({
      principal,
      annualRate: '5',
      months: '12',
    })

    expect(errors.principal).toBe('대출원금은 0보다 큰 숫자를 입력해 주세요.')
  })

  it.each([
    { months: '0', label: '0개월' },
    { months: '-12', label: '음수' },
    { months: '', label: '빈 값' },
    { months: '12.5', label: '소수' },
    { months: 'abc', label: '문자' },
  ])('기간 $label — 계산하지 않고 안내 메시지', ({ months }) => {
    const errors = validateLoanForm({
      principal: '10000000',
      annualRate: '5',
      months,
    })

    expect(errors.months).toBe('상환기간(개월)은 1 이상의 정수를 입력해 주세요.')
  })

  it('이자율 0% — 정상 계산(균등 분할)', () => {
    const errors = validateLoanForm({
      principal: '12000000',
      annualRate: '0',
      months: '12',
    })

    expect(errors.principal).toBeUndefined()
    expect(errors.annualRate).toBeUndefined()
    expect(errors.months).toBeUndefined()

    const result = calculateRepayment({
      principal: 12_000_000,
      annualRate: 0,
      months: 12,
    })

    expect(roundWon(result.monthlyPayment)).toBe(1_000_000)
    expect(roundWon(result.totalInterest)).toBe(0)
  })

  it('이자율 빈 값 — 안내 메시지', () => {
    const errors = validateLoanForm({
      principal: '10000000',
      annualRate: '',
      months: '12',
    })

    expect(errors.annualRate).toBe('연 이자율은 0 이상의 숫자를 입력해 주세요.')
  })

  it('이자율 음수 — 안내 메시지', () => {
    const errors = validateLoanForm({
      principal: '10000000',
      annualRate: '-1',
      months: '12',
    })

    expect(errors.annualRate).toBe('연 이자율은 0 이상의 숫자를 입력해 주세요.')
  })
})

describe('예외·경계값 — 입력값 필터링', () => {
  it('정수 필드에서 문자·특수문자를 제거한다', () => {
    expect(sanitizeIntegerInput('1000abc')).toBe('1000')
    expect(sanitizeIntegerInput('12@34!56')).toBe('123456')
    expect(sanitizeIntegerInput('-500')).toBe('500')
    expect(sanitizeIntegerInput('')).toBe('')
  })

  it('소수 필드에서 숫자와 소수점만 허용한다', () => {
    expect(sanitizeDecimalInput('4.5%')).toBe('4.5')
    expect(sanitizeDecimalInput('3..14')).toBe('3.14')
    expect(sanitizeDecimalInput('abc')).toBe('')
  })
})
