import { describe, expect, it } from 'vitest'
import { calculateRepayment, calculateSavingsMaturity, monthlyPayment } from './finance'

/** 4주차 TDD — 강의 예시 형식 */
describe('대출 상환 계산기', () => {
  it('1,000만원 / 연 5% / 12개월 → 월 856,075원', () => {
    expect(monthlyPayment(10_000_000, 5, 12)).toBe(856_075)
  })

  it('3,000만원 / 연 4.5% / 36개월 → 월 892,408원', () => {
    expect(monthlyPayment(30_000_000, 4.5, 36)).toBe(892_408)
  })

  it('이자율 0%이면 원금을 개월 수로 균등 분할', () => {
    expect(monthlyPayment(12_000_000, 0, 12)).toBe(1_000_000)
  })
})

/** 채점 기준 — 원 단위 반올림 */
const roundWon = (value: number): number => Math.round(value)

describe('채점 시나리오 — 대출 상환 계산기', () => {
  const cases = [
    { id: '①', principal: 10_000_000, annualRate: 5.0, months: 12, monthly: 856_075 },
    { id: '②', principal: 30_000_000, annualRate: 4.5, months: 36, monthly: 892_408 },
    { id: '③', principal: 50_000_000, annualRate: 3.9, months: 60, monthly: 918_571 },
    { id: '④', principal: 5_000_000, annualRate: 6.0, months: 6, monthly: 847_977 },
    { id: '⑤', principal: 12_000_000, annualRate: 0.0, months: 12, monthly: 1_000_000 },
  ] as const

  it.each(cases)('$id 월 상환액(원 단위 반올림)', ({ principal, annualRate, months, monthly }) => {
    expect(monthlyPayment(principal, annualRate, months)).toBe(monthly)
  })

  it('⑤ 이자율 0% — 총 이자 0원', () => {
    const result = calculateRepayment({
      principal: 12_000_000,
      annualRate: 0,
      months: 12,
    })
    expect(roundWon(result.totalInterest)).toBe(0)
  })

  it('케이스 ① — 1회차: 이자 41,667원 / 납입원금 814,408원 / 잔액 9,185,592원', () => {
    const result = calculateRepayment({
      principal: 10_000_000,
      annualRate: 5.0,
      months: 12,
    })
    const first = result.schedule[0]!

    expect(roundWon(first.interest)).toBe(41_667)
    expect(roundWon(first.principal)).toBe(814_408)
    expect(roundWon(first.balance)).toBe(9_185_592)
  })

  it('케이스 ① — 12회차 잔액 0원', () => {
    const result = calculateRepayment({
      principal: 10_000_000,
      annualRate: 5.0,
      months: 12,
    })
    expect(result.schedule.at(-1)?.balance).toBe(0)
  })
})

describe('calculateRepayment', () => {
  it('원리금균등 상환: 월 상환액·총액·스케줄을 계산한다', () => {
    const result = calculateRepayment({
      principal: 10_000_000,
      annualRate: 4.5,
      months: 60,
    })

    expect(result.monthlyPayment).toBe(186_430.19)
    expect(result.totalPayment).toBe(11_185_811.54)
    expect(result.totalInterest).toBe(1_185_811.54)
    expect(result.schedule).toHaveLength(60)
    expect(result.schedule[0]?.month).toBe(1)
    expect(result.schedule.at(-1)?.balance).toBe(0)
  })

  it('이자율 0%이면 원금을 균등 분할 상환한다', () => {
    const result = calculateRepayment({
      principal: 1_200_000,
      annualRate: 0,
      months: 12,
    })

    expect(result.monthlyPayment).toBe(100_000)
    expect(result.totalInterest).toBe(0)
    expect(result.totalPayment).toBe(1_200_000)

    result.schedule.forEach((row) => {
      expect(row.interest).toBe(0)
      expect(row.principal).toBe(100_000)
      expect(row.payment).toBe(100_000)
    })

    expect(result.schedule.at(-1)?.balance).toBe(0)
  })

  it('1개월 상환 시 원금+이자를 한 번에 갚는다', () => {
    const result = calculateRepayment({
      principal: 1_000_000,
      annualRate: 6,
      months: 1,
    })

    expect(result.schedule).toHaveLength(1)
    expect(result.schedule[0]?.interest).toBe(5_000)
    expect(result.schedule[0]?.principal).toBe(1_000_000)
    expect(result.schedule[0]?.payment).toBe(1_005_000)
    expect(result.schedule[0]?.balance).toBe(0)
    expect(result.totalPayment).toBe(1_005_000)
  })

  it('스케줄 각 회차의 원금+이자는 상환액과 같다', () => {
    const result = calculateRepayment({
      principal: 5_000_000,
      annualRate: 3.6,
      months: 24,
    })

    result.schedule.forEach((row) => {
      // 회차별 round2 처리로 0.01원 이내 오차가 발생할 수 있다
      expect(Math.abs(row.principal + row.interest - row.payment)).toBeLessThanOrEqual(0.011)
    })
  })

  it('마지막 회차 잔액은 0이어야 한다', () => {
    const result = calculateRepayment({
      principal: 30_000_000,
      annualRate: 5.2,
      months: 36,
    })

    expect(result.schedule.at(-1)?.balance).toBe(0)
  })

  describe('입력 검증', () => {
    it('원금이 0 이하면 에러를 던진다', () => {
      expect(() =>
        calculateRepayment({ principal: 0, annualRate: 4, months: 12 }),
      ).toThrow('대출원금은 0보다 큰 숫자여야 합니다.')

      expect(() =>
        calculateRepayment({ principal: -1, annualRate: 4, months: 12 }),
      ).toThrow('대출원금은 0보다 큰 숫자여야 합니다.')
    })

    it('연 이자율이 음수이면 에러를 던진다', () => {
      expect(() =>
        calculateRepayment({ principal: 1_000_000, annualRate: -0.1, months: 12 }),
      ).toThrow('연 이자율은 0 이상의 숫자여야 합니다.')
    })

    it('상환기간이 1 미만이거나 정수가 아니면 에러를 던진다', () => {
      expect(() =>
        calculateRepayment({ principal: 1_000_000, annualRate: 4, months: 0 }),
      ).toThrow('상환기간(개월)은 1 이상의 정수여야 합니다.')

      expect(() =>
        calculateRepayment({ principal: 1_000_000, annualRate: 4, months: 12.5 }),
      ).toThrow('상환기간(개월)은 1 이상의 정수여야 합니다.')
    })
  })
})

describe('calculateSavingsMaturity', () => {
  it('단리: 만기금액과 이자수익을 계산한다', () => {
    const result = calculateSavingsMaturity({
      principal: 10_000_000,
      annualRate: 3.2,
      months: 12,
      interestType: 'simple',
    })

    expect(result.maturityAmount).toBe(10_320_000)
    expect(result.interestAmount).toBe(320_000)
  })

  it('복리(월복리): 만기금액과 이자수익을 계산한다', () => {
    const result = calculateSavingsMaturity({
      principal: 10_000_000,
      annualRate: 3.2,
      months: 12,
      interestType: 'compound',
    })

    expect(result.maturityAmount).toBe(10_324_735.3)
    expect(result.interestAmount).toBe(324_735.3)
  })

  it('복리 이자는 단리 이자보다 크다', () => {
    const input = {
      principal: 10_000_000,
      annualRate: 3.2,
      months: 12,
    } as const

    const simple = calculateSavingsMaturity({ ...input, interestType: 'simple' })
    const compound = calculateSavingsMaturity({ ...input, interestType: 'compound' })

    expect(compound.interestAmount).toBeGreaterThan(simple.interestAmount)
  })

  it('이자율 0%이면 만기금액은 원금과 같다', () => {
    const result = calculateSavingsMaturity({
      principal: 5_000_000,
      annualRate: 0,
      months: 24,
      interestType: 'compound',
    })

    expect(result.maturityAmount).toBe(5_000_000)
    expect(result.interestAmount).toBe(0)
  })

  describe('입력 검증', () => {
    it('원금이 0 이하면 에러를 던진다', () => {
      expect(() =>
        calculateSavingsMaturity({
          principal: 0,
          annualRate: 3,
          months: 12,
          interestType: 'simple',
        }),
      ).toThrow('예·적금 원금은 0보다 큰 숫자여야 합니다.')
    })

    it('연 이자율이 음수이면 에러를 던진다', () => {
      expect(() =>
        calculateSavingsMaturity({
          principal: 1_000_000,
          annualRate: -1,
          months: 12,
          interestType: 'simple',
        }),
      ).toThrow('연 이자율은 0 이상의 숫자여야 합니다.')
    })

    it('가입기간이 1 미만이거나 정수가 아니면 에러를 던진다', () => {
      expect(() =>
        calculateSavingsMaturity({
          principal: 1_000_000,
          annualRate: 3,
          months: 0,
          interestType: 'simple',
        }),
      ).toThrow('가입기간(개월)은 1 이상의 정수여야 합니다.')
    })

    it('이자 방식이 올바르지 않으면 에러를 던진다', () => {
      expect(() =>
        calculateSavingsMaturity({
          principal: 1_000_000,
          annualRate: 3,
          months: 12,
          interestType: 'monthly' as 'simple',
        }),
      ).toThrow('이자 계산 방식이 올바르지 않습니다.')
    })
  })
})
