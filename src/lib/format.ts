/** 금액을 천 단위 콤마와 '원' 단위로 표시합니다. */
export function formatWon(value: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(Math.round(value))}원`
}
