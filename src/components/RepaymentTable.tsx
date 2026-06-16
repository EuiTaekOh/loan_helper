import { type RepaymentRow } from '../lib/finance'
import { formatWon } from '../lib/format'

interface RepaymentTableProps {
  schedule: RepaymentRow[]
}

function RepaymentTable({ schedule }: RepaymentTableProps) {
  const downloadCsv = () => {
    if (schedule.length === 0) {
      return
    }

    const header = ['회차', '월 상환액', '원금', '이자', '잔액']
    const rows = schedule.map((row) => [
      row.month.toString(),
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.balance.toFixed(2),
    ])

    const csv = [header, ...rows].map((line) => line.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'repayment_schedule.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="toss-section-header">
        <h2 className="toss-title">월별 상환 스케줄</h2>
        <div className="toss-action-row">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={schedule.length === 0}
            className="toss-btn-secondary"
          >
            CSV 다운로드
          </button>
          <button type="button" onClick={() => window.print()} className="toss-btn-secondary">
            인쇄
          </button>
        </div>
      </div>

      {schedule.length === 0 ? (
        <p className="mt-4 text-[15px] text-toss-grey-600 dark:text-toss-grey-400">
          계산 결과가 없어요. 상환 조건을 입력하고 계산해 주세요.
        </p>
      ) : (
        <div className="toss-table-scroll mt-4 rounded-toss-m border border-toss-grey-200 dark:border-toss-grey-600">
          <table className="w-full border-collapse">
            <thead>
              <tr className="toss-table-head">
                <th className="px-4 py-3">회차</th>
                <th className="px-4 py-3">월 상환액</th>
                <th className="px-4 py-3">원금</th>
                <th className="px-4 py-3">이자</th>
                <th className="px-4 py-3">잔액</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month}>
                  <td className="toss-table-cell">{row.month}</td>
                  <td className="toss-table-cell">{formatWon(row.payment)}</td>
                  <td className="toss-table-cell">{formatWon(row.principal)}</td>
                  <td className="toss-table-cell">{formatWon(row.interest)}</td>
                  <td className="toss-table-cell">{formatWon(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RepaymentTable
