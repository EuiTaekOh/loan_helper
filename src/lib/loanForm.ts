export interface LoanFormErrors {
  principal?: string
  annualRate?: string
  months?: string
  common?: string
}

/** 정수 입력 — 숫자만 허용 */
export function sanitizeIntegerInput(value: string): string {
  return value.replace(/\D/g, '')
}

/** 소수 입력 — 숫자와 소수점 1개만 허용 */
export function sanitizeDecimalInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '')
  const [integer = '', ...rest] = cleaned.split('.')
  if (rest.length === 0) {
    return integer
  }
  return `${integer}.${rest.join('')}`
}

export function validateLoanForm(fields: {
  principal: string
  annualRate: string
  months: string
}): LoanFormErrors {
  const errors: LoanFormErrors = {}
  const principalNum = Number(fields.principal)
  const annualRateNum = Number(fields.annualRate)
  const monthsNum = Number(fields.months)

  if (
    fields.principal.trim() === '' ||
    !Number.isFinite(principalNum) ||
    principalNum <= 0
  ) {
    errors.principal = '대출원금은 0보다 큰 숫자를 입력해 주세요.'
  }

  if (
    fields.annualRate.trim() === '' ||
    !Number.isFinite(annualRateNum) ||
    annualRateNum < 0
  ) {
    errors.annualRate = '연 이자율은 0 이상의 숫자를 입력해 주세요.'
  }

  if (
    fields.months.trim() === '' ||
    !Number.isFinite(monthsNum) ||
    monthsNum <= 0 ||
    !Number.isInteger(monthsNum)
  ) {
    errors.months = '상환기간(개월)은 1 이상의 정수를 입력해 주세요.'
  }

  return errors
}

export function validateSavingsForm(fields: {
  principal: string
  annualRate: string
  months: string
}): LoanFormErrors {
  const errors: LoanFormErrors = {}
  const principalNum = Number(fields.principal)
  const annualRateNum = Number(fields.annualRate)
  const monthsNum = Number(fields.months)

  if (
    fields.principal.trim() === '' ||
    !Number.isFinite(principalNum) ||
    principalNum <= 0
  ) {
    errors.principal = '예·적금 원금은 0보다 큰 숫자를 입력해 주세요.'
  }

  if (
    fields.annualRate.trim() === '' ||
    !Number.isFinite(annualRateNum) ||
    annualRateNum < 0
  ) {
    errors.annualRate = '연 이자율은 0 이상의 숫자를 입력해 주세요.'
  }

  if (
    fields.months.trim() === '' ||
    !Number.isFinite(monthsNum) ||
    monthsNum <= 0 ||
    !Number.isInteger(monthsNum)
  ) {
    errors.months = '가입기간(개월)은 1 이상의 정수를 입력해 주세요.'
  }

  return errors
}

export function hasFormErrors(errors: LoanFormErrors): boolean {
  return Object.keys(errors).length > 0
}
