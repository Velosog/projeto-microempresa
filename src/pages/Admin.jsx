import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clinic from '../data/clinic.json'
import {
  getTemplate,
  getFallback,
  saveTemplateOverrides,
  resetTemplateOverrides,
  renderTemplate,
  getLeadData,
} from '../utils/whatsapp'

const MOCK_LEAD = {
  procedure: 'Clareamento Dental',
  urgency: 'Pode aguardar',
  firstTime: 'Sim',
  insurance: 'Unimed',
  preferredTime: 'Terça de manhã',
  complaint: 'Quero deixar meus dentes mais brancos',
}

/**
 * Admin page for configuring WhatsApp pre-fill templates.
 * Accessible via /admin (no link in menu).
 * Uses localStorage for persistence — no backend needed.
 */
export default function Admin() {
  const navigate = useNavigate()
  const [template, setTemplate] = useState('')
  const [fallback, setFallback] = useState('')
  const [saved, setSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState('mock') // 'mock' | 'real'

  // Set CSS variables for theming
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', clinic.primaryColor)
    root.style.setProperty('--color-primary-dark', clinic.primaryColorDark)
    root.style.setProperty('--color-primary-light', clinic.primaryColorLight)
    document.title = `Admin – ${clinic.name}`
  }, [])

  // Load current templates
  useEffect(() => {
    setTemplate(getTemplate())
    setFallback(getFallback())
  }, [])

  const realLead = getLeadData()
  const hasRealData = Object.values(realLead).some((v) => v && v.trim())

  const previewData = previewMode === 'mock' ? MOCK_LEAD : realLead
  const previewTemplate = useMemo(() => renderTemplate(template, previewData), [template, previewData])
  const previewFallback = useMemo(() => renderTemplate(fallback, previewData), [fallback, previewData])

  function handleSave() {
    saveTemplateOverrides(template, fallback)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    resetTemplateOverrides()
    setTemplate(clinic.whatsappPrefillTemplate)
    setFallback(clinic.whatsappPrefillFallback)
    setSaved(false)
  }

  const availablePlaceholders = [
    { key: '{clinicName}', desc: 'Nome da clínica' },
    { key: '{procedure}', desc: 'Procedimento desejado' },
    { key: '{urgency}', desc: 'Nível de urgência' },
    { key: '{firstTime}', desc: 'Primeira vez na clínica' },
    { key: '{insurance}', desc: 'Convênio ou particular' },
    { key: '{preferredTime}', desc: 'Dia/turno preferido' },
    { key: '{complaint}', desc: 'Queixa principal' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: clinic.primaryColor }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">Painel Admin</h1>
              <p className="text-xs text-gray-400">{clinic.name}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao site
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-10 py-10">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Pré-Preenchida do WhatsApp</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Configure o template da mensagem que será enviada automaticamente quando o paciente
            clicar em qualquer botão de WhatsApp do site. Os dados coletados pelo chatbot preenchem
            os campos dinamicamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — Editors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template principal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Template Principal
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Usado quando o chatbot coletou pelo menos 2 informações do lead.
              </p>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': clinic.primaryColor }}
              />
            </div>

            {/* Fallback */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Template Fallback
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Usado quando o visitante clica antes de interagir com o chatbot.
              </p>
              <textarea
                value={fallback}
                onChange={(e) => setFallback(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': clinic.primaryColor }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-sm"
                style={{
                  backgroundColor: clinic.primaryColor,
                  boxShadow: `0 4px 14px ${clinic.primaryColor}30`,
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar alterações
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-600 font-medium px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resetar para padrão
              </button>

              {saved && (
                <span className="text-sm text-green-600 font-medium animate-fade-in flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvo!
                </span>
              )}
            </div>
          </div>

          {/* Right column — Placeholders & Preview */}
          <div className="space-y-6">
            {/* Available placeholders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Placeholders disponíveis</h3>
              <div className="space-y-2">
                {availablePlaceholders.map((p) => (
                  <div key={p.key} className="flex items-center gap-2">
                    <code
                      className="text-xs font-mono px-2 py-1 rounded-lg flex-shrink-0"
                      style={{
                        color: clinic.primaryColor,
                        backgroundColor: clinic.primaryColor + '10',
                      }}
                    >
                      {p.key}
                    </code>
                    <span className="text-xs text-gray-500">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Preview em tempo real</h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode('mock')}
                    className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                      previewMode === 'mock'
                        ? 'bg-white shadow-sm text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Mock
                  </button>
                  <button
                    onClick={() => setPreviewMode('real')}
                    disabled={!hasRealData}
                    className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                      previewMode === 'real'
                        ? 'bg-white shadow-sm text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    Real
                  </button>
                </div>
              </div>

              {/* Template preview */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Template principal
                </p>
                <div
                  className="text-sm text-gray-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap"
                >
                  {previewTemplate}
                </div>
              </div>

              {/* Fallback preview */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Fallback
                </p>
                <div
                  className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap"
                >
                  {previewFallback}
                </div>
              </div>

              {/* Real lead data details */}
              {previewMode === 'real' && hasRealData && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Dados coletados do lead
                  </p>
                  <div className="space-y-1.5">
                    {Object.entries(realLead).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-mono w-28">{key}:</span>
                        <span className={val ? 'text-gray-700' : 'text-gray-300 italic'}>
                          {val || '(vazio)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
