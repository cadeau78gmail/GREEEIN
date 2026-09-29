import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Globe, TrendingUp, Calendar, FileText, Download, X } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import Modal from '../components/Modal.jsx'
import { getLocalData } from '../lib/localData.js'

const ICONS = { globe: Globe, 'trending-up': TrendingUp, calendar: Calendar }

function normalizeReport(report, reportStats) {
  return {
    ...report,
    stats: report.stats || reportStats.slice(0, 3),
    summary: report.summary || 'This report contains the current forest monitoring data received from the backend.',
    bullets: report.bullets || [
      'Threat activity is based on detections recorded in the current session.',
      'Sensor and zone statistics reflect the latest backend state.',
      'Continue monitoring active areas and resolve threats as they are confirmed.'
    ],
    viewUrl: report.viewUrl || '#',
    downloadUrl: report.downloadUrl || '#'
  }
}

function ReportTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
        padding: '10px 12px',
        color: 'var(--color-text-heading)'
      }}
    >
      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ margin: '2px 0', fontSize: 12, color: 'var(--color-text-body)' }}>
          {entry.name}: <strong style={{ color: 'var(--color-text-heading)' }}>{entry.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Reports() {
  const [hoveredReport, setHoveredReport] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isMakeReportOpen, setIsMakeReportOpen] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])
  const [reportForm, setReportForm] = useState({
    title: '',
    period: '',
    focus: '',
    summary: '',
    metrics: ''
  })
  const data = getLocalData('/reports')

  const { reportStats, threatsVsResolved, hectaresSavedMonthly, availableReports } = data
  const reportList = [
    ...generatedReports.map((report) => normalizeReport(report, reportStats)),
    ...availableReports.map((report) => normalizeReport(report, reportStats))
  ]

  const handleViewReport = (report) => {
    setSelectedReport(report)
  }

  const handleGenerateReport = () => {
    const generatedReport = {
      title: `${reportForm.title || 'Custom Report'} — ${reportForm.period || 'Current Period'}`,
      date: `${reportForm.period || 'Current Period'}`,
      size: '2.1 MB',
      type: 'AI Report',
      summary:
        reportForm.summary ||
        'This report was generated from the current monitoring data and highlights the most relevant operational insights for the selected period.',
      bullets: [
        `Primary focus: ${reportForm.focus || 'forest protection activity'}.`,
        `Key metrics included: ${reportForm.metrics || 'threats, resolution, hectares saved'}.`,
        'Recommended action: continue active monitoring and field intervention in the highest-risk zones.'
      ],
      stats: [
        { label: 'FOCUS AREA', value: (reportForm.focus || 'Threat detection').slice(0, 18) },
        { label: 'REPORT TYPE', value: 'AI SUMMARY' },
        { label: 'PERIOD', value: reportForm.period || 'Current' }
      ],
      viewUrl: '/reports/custom-report.html',
      downloadUrl: '/reports/custom-report.html'
    }

    setGeneratedReports((current) => [generatedReport, ...current])
    setSelectedReport(normalizeReport(generatedReport, reportStats))
    setIsMakeReportOpen(false)
    setReportForm({
      title: '',
      period: '',
      focus: '',
      summary: '',
      metrics: ''
    })
  }

  return (
    <div>
      <TopBar title="Canopy Dashboard" subtitle="AI Forest Monitoring · Real-time" />

      <div className="p-6 md:p-10 space-y-6">
        <div>
          <h3 className="font-serif text-2xl text-slate-50">Analytics &amp; Reports</h3>
          <p className="text-sm text-slate-500 mt-1">Data-driven insights on forest protection activity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reportStats.map((s) => {
            const Icon = ICONS[s.icon]
            return (
              <div
                key={s.label}
                className="card p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] hover:border-ember-500/30 hover:bg-base-800"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-9 h-9 rounded-lg bg-moss-500/15 text-moss-400 flex items-center justify-center">
                    <Icon size={17} />
                  </div>
                  <span className="text-xs font-semibold rounded-full px-2 py-0.5 text-moss-400 bg-moss-500/10">
                    {s.change}
                  </span>
                </div>
                <p className="font-serif text-3xl text-slate-50">{s.value}</p>
                <p className="text-sm text-slate-500 mt-2">{s.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-serif text-xl text-slate-50">Threats vs. Resolved</h3>
            <p className="text-sm text-slate-500 mb-4">Monthly breakdown across all zones</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatsVsResolved}>
                  <defs>
                    <linearGradient id="reportDetected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="reportResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ReportTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="detected" name="Threats" stroke="var(--color-accent)" fill="url(#reportDetected)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="var(--color-success)" fill="url(#reportResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-serif text-xl text-slate-50">Hectares Saved Monthly</h3>
            <p className="text-sm text-slate-500 mb-4">Forest area protected through early intervention</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hectaresSavedMonthly}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ReportTooltip />} cursor={{ fill: 'var(--color-success)', fillOpacity: 0.08 }} />
                  <Bar dataKey="hectares" fill="var(--color-success)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-slate-50">Available Reports</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{reportList.length} documents</span>
              <button
                type="button"
                onClick={() => setIsMakeReportOpen(true)}
                className="rounded-xl bg-ember-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ember-600"
              >
                Make Report
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {reportList.map((r) => {
              const isHighlighted = hoveredReport === r.title

              return (
                <div
                  key={r.title}
                  onMouseEnter={() => setHoveredReport(r.title)}
                  onMouseLeave={() => setHoveredReport(null)}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                    isHighlighted
                      ? 'border-ember-500/40 bg-base-800 shadow-sm'
                      : 'border-base-700/60 hover:border-ember-500/30 hover:bg-base-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-ember-500/10 text-ember-500 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${isHighlighted ? 'text-ember-400' : 'text-slate-100'}`}>
                      {r.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.date} · {r.size} · {r.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewReport(r)}
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-300 border border-base-700 bg-base-900 rounded-lg px-3 py-1.5 hover:border-ember-500/60 hover:text-ember-400 transition-colors"
                    >
                      View
                    </button>
                    <a
                      href={r.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-300 border border-base-700 bg-base-900 rounded-lg px-3 py-1.5 hover:border-ember-500/60 hover:text-ember-400 transition-colors"
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isMakeReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-[820px] rounded-[30px] border border-base-700 bg-base-900 p-7 text-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Make Report</h2>
                <p className="mt-1 text-sm text-slate-500">Create a new report from the latest forest monitoring data</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMakeReportOpen(false)}
                className="dark-icon-button flex h-10 w-10 items-center justify-center rounded-full border border-base-700 bg-base-800 text-slate-400 transition-colors hover:border-base-600 hover:text-slate-900"
                aria-label="Close create report dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-500">Report title</span>
                <input
                  value={reportForm.title}
                  onChange={(event) => setReportForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-xl border border-base-700 bg-base-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-ember-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-500">Period</span>
                <input
                  value={reportForm.period}
                  onChange={(event) => setReportForm((current) => ({ ...current, period: event.target.value }))}
                  className="w-full rounded-xl border border-base-700 bg-base-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-ember-500"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-500">Report focus</span>
                <input
                  value={reportForm.focus}
                  onChange={(event) => setReportForm((current) => ({ ...current, focus: event.target.value }))}
                  className="w-full rounded-xl border border-base-700 bg-base-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-ember-500"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-500">Metrics to include</span>
                <input
                  value={reportForm.metrics}
                  onChange={(event) => setReportForm((current) => ({ ...current, metrics: event.target.value }))}
                  className="w-full rounded-xl border border-base-700 bg-base-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-ember-500"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-500">Summary</span>
                <textarea
                  value={reportForm.summary}
                  onChange={(event) => setReportForm((current) => ({ ...current, summary: event.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-base-700 bg-base-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-ember-500"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsMakeReportOpen(false)}
                className="rounded-lg border border-base-700 bg-base-800 px-4 py-2 text-sm font-medium text-slate-300 hover:border-base-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateReport}
                className="rounded-xl bg-ember-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-ember-600"
              >
                Generate report
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-[1200px] rounded-[30px] border border-base-700 bg-base-900 p-8 text-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{selectedReport.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedReport.date} · {selectedReport.size} · {selectedReport.type}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="dark-icon-button flex h-10 w-10 items-center justify-center rounded-full border border-base-700 bg-base-800 text-slate-400 transition-colors hover:border-base-600 hover:text-slate-900"
                aria-label="Close report details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {selectedReport.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-base-700 bg-base-800 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-6 text-slate-300">
              <p className="text-base leading-relaxed">{selectedReport.summary}</p>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">Key actions taken</h3>
                <ul className="mt-5 list-disc space-y-3 pl-8 text-base leading-relaxed">
                  {selectedReport.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
