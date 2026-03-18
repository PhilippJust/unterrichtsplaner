'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  GeminiClient,
  UnterrichtsablaufGenerator,
  ArbeitsblattGenerator,
  unterrichtsAblaufToDocx,
  arbeitsblattToDocx,
  type Unterrichtsablauf,
  type Arbeitsblatt,
} from '@unterrichtsplaner/core'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {
  Key,
  AlertTriangle,
  FileText,
  Wand2,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { encryptData, decryptData, type EncryptedData } from './lib/crypto'

const STORAGE_KEY = 'gemini_api_key_data'

export default function UnterrichtsPlaner() {
  const [apiKey, setApiKey] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false)
  const [requiresPassword, setRequiresPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    fach: '',
    themengebiet: '',
    zielsetzung: '',
    dauer: 45,
    klassengroesse: 25,
    klassenstufe: 8,
    schulform: 'Gymnasium',
  })

  // Results State
  const [lessonPlan, setLessonPlan] = useState<Unterrichtsablauf | null>(null)
  const [worksheet, setWorksheet] = useState<Arbeitsblatt | null>(null)
  const [iterationFeedback, setIterationFeedback] = useState('')

  // Core Refs
  const geminiClientRef = useRef<GeminiClient | null>(null)
  const lpGeneratorRef = useRef<UnterrichtsablaufGenerator | null>(null)
  const wsGeneratorRef = useRef<ArbeitsblattGenerator | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as EncryptedData
        if (!parsed.encrypted) {
          setApiKey(parsed.data)
          setIsApiKeySet(true)
          initGenerators(parsed.data)
        } else {
          setRequiresPassword(true)
        }
      } catch (e) {
        console.error('Fehler beim Laden der API-Key-Daten', e)
      }
    }
  }, [])

  const initGenerators = (key: string) => {
    try {
      const client = new GeminiClient({ apiKey: key })
      geminiClientRef.current = client
      lpGeneratorRef.current = new UnterrichtsablaufGenerator(client)
      wsGeneratorRef.current = new ArbeitsblattGenerator(client)
    } catch (e) {
      setError('Fehler beim Initialisieren der KI: ' + (e as Error).message)
    }
  }

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) return
    setLoading(true)
    setError(null)
    try {
      const encrypted = await encryptData(apiKey, password)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted))
      setIsApiKeySet(true)
      initGenerators(apiKey)
    } catch (e) {
      setError('Fehler beim Speichern: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = async () => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) return
    setLoading(true)
    setError(null)
    try {
      const parsed = JSON.parse(savedData) as EncryptedData
      const decryptedKey = await decryptData(parsed, password)
      setApiKey(decryptedKey)
      setIsApiKeySet(true)
      setRequiresPassword(false)
      initGenerators(decryptedKey)
    } catch {
      setError('Falsches Passwort oder Fehler beim Entschlüsseln')
    } finally {
      setLoading(false)
    }
  }

  const handleResetApiKey = () => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
    setPassword('')
    setIsApiKeySet(false)
    setRequiresPassword(false)
    geminiClientRef.current = null
    lpGeneratorRef.current = null
    wsGeneratorRef.current = null
  }

  const generateLessonPlan = async () => {
    if (!lpGeneratorRef.current) return
    setLoading(true)
    setError(null)
    try {
      const result = await lpGeneratorRef.current.generiere(form)
      setLessonPlan(result)
    } catch (e) {
      setError('Fehler bei der Generierung: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const iterateLessonPlan = async () => {
    if (!lpGeneratorRef.current || !iterationFeedback.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await lpGeneratorRef.current.iteriere(iterationFeedback)
      setLessonPlan(result)
      setIterationFeedback('')
    } catch (e) {
      setError('Fehler bei der Iteration: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const generateWorksheet = async () => {
    if (!wsGeneratorRef.current) return
    setLoading(true)
    setError(null)
    try {
      const result = await wsGeneratorRef.current.generiere(undefined)
      setWorksheet(result)
    } catch (e) {
      setError(
        'Fehler bei der Arbeitsblatt-Generierung: ' + (e as Error).message
      )
    } finally {
      setLoading(false)
    }
  }

  const iterateWorksheet = async () => {
    if (!wsGeneratorRef.current || !iterationFeedback.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await wsGeneratorRef.current.iteriere(iterationFeedback)
      setWorksheet(result)
      setIterationFeedback('')
    } catch (e) {
      setError('Fehler bei der Iteration: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadZip = async () => {
    if (!lessonPlan) return
    setLoading(true)
    try {
      const zip = new JSZip()
      const lpBlob = await unterrichtsAblaufToDocx(lessonPlan)
      zip.file('Unterrichtsablauf.docx', lpBlob)

      if (worksheet) {
        const wsDocs = await arbeitsblattToDocx({
          ...worksheet,
          thema: lessonPlan.thema,
        })
        zip.file('Musterloesung.docx', wsDocs.musterloesung)
        wsDocs.arbeitsblaetter.forEach((blob, i) => {
          zip.file(`Arbeitsblatt_Variante_${i + 1}.docx`, blob)
        })
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(
        content,
        `Unterrichtsmaterial_${lessonPlan.thema.replace(/\s+/g, '_')}.zip`
      )
    } catch (e) {
      setError('Fehler beim Download: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (requiresPassword && !isApiKeySet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              API-Key verschlüsselt
            </h1>
            <p className="text-gray-500">
              Bitte gib dein Passwort ein, um den Key zu entsperren.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleResetApiKey}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
              >
                Zurücksetzen
              </button>
              <button
                onClick={handleUnlock}
                disabled={loading || !password}
                className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  'Entsperren'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Key size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Willkommen beim Unterrichtsplaner
            </h1>
            <p className="text-gray-500">
              Bitte gib deinen Gemini API-Key ein, um zu starten.
            </p>
            <p className="text-gray-500">
              Wie du einen API-Key erhältst, kannst du{' '}
              <a
                className="text-blue-500 underline"
                href="https://ai.google.dev/gemini-api/docs/api-key"
              >
                in der Dokumentation von Google
              </a>{' '}
              nachlesen.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort (optional)
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Für lokale Verschlüsselung"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Wenn du ein Passwort angibst, wird der Key AES-256 verschlüsselt
                gespeichert.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Sicherheitshinweis:</p>
                <p>
                  Dein API-Key wird lokal in deinem Browser gespeichert. Nutze
                  ein Passwort für zusätzliche Sicherheit.
                </p>
                <p>
                  Verwende einen kostenlosen Key oder setze Nutzungslimits, um
                  den möglichen Schaden bei einem Missbrauch zu begrenzen.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSetApiKey}
              disabled={loading || !apiKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Starten <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Wand2 size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Unterrichtsplaner
            </span>
          </div>
          <button
            onClick={handleResetApiKey}
            className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="API Key zurücksetzen"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Flow */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Unterrichtsdetails
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Fach
                </label>
                <input
                  list="faecher"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.fach}
                  onChange={(e) => setForm({ ...form, fach: e.target.value })}
                  placeholder="z.B. Deutsch"
                />
                <datalist id="faecher">
                  <option value="Deutsch" />
                  <option value="Mathematik" />
                  <option value="Englisch" />
                  <option value="Biologie" />
                  <option value="Physik" />
                  <option value="Chemie" />
                  <option value="Geschichte" />
                  <option value="Erdkunde" />
                  <option value="Politik" />
                  <option value="Kunst" />
                  <option value="Musik" />
                  <option value="Sport" />
                  <option value="Religion" />
                  <option value="Ethik" />
                  <option value="Informatik" />
                  <option value="Spanisch" />
                  <option value="Französisch" />
                  <option value="Latein" />
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Themengebiet
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.themengebiet}
                  onChange={(e) =>
                    setForm({ ...form, themengebiet: e.target.value })
                  }
                  placeholder="z.B. Gedichtanalyse"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Zielsetzung
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  value={form.zielsetzung}
                  onChange={(e) =>
                    setForm({ ...form, zielsetzung: e.target.value })
                  }
                  placeholder="Was sollen die Schüler lernen?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Dauer (Min)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.dauer}
                    onChange={(e) =>
                      setForm({ ...form, dauer: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Klassenstufe
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.klassenstufe}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        klassenstufe: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Klassengröße
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.klassengroesse}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      klassengroesse: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Schulform
                </label>
                <input
                  list="schulformen"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={form.schulform}
                  onChange={(e) =>
                    setForm({ ...form, schulform: e.target.value })
                  }
                  placeholder="z.B. Gymnasium"
                />
                <datalist id="schulformen">
                  <option value="Gymnasium" />
                  <option value="Oberschule" />
                  <option value="Realschule" />
                  <option value="Hauptschule" />
                  <option value="Grundschule" />
                  <option value="Berufsschule" />
                  <option value="Gesamtschule" />
                  <option value="Förderschule" />
                </datalist>
              </div>
            </div>

            <button
              onClick={generateLessonPlan}
              disabled={loading || !form.fach || !form.themengebiet}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Wand2 size={18} />
              )}
              Entwurf erstellen
            </button>
          </section>

          {lessonPlan && (
            <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Check size={20} className="text-green-600" />
                Nächste Schritte
              </h2>
              <div className="space-y-3">
                {!worksheet && (
                  <button
                    onClick={generateWorksheet}
                    disabled={loading}
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                    Arbeitsblatt erstellen
                  </button>
                )}
                <button
                  onClick={downloadZip}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Alles herunterladen (.zip)
                </button>
              </div>
            </section>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Content Display */}
        <div className="lg:col-span-8 space-y-8">
          {lessonPlan ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-gray-700">
                    Unterrichtsentwurf: {lessonPlan.thema}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Erstellt
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Lernziele
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {lessonPlan.lernziele.map((lz, i) => (
                        <li key={i}>{lz}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <PhaseDisplay
                      title="Einstieg"
                      aktionen={lessonPlan.einstiegsphase}
                    />
                    <PhaseDisplay
                      title="Erarbeitung"
                      aktionen={lessonPlan.erarbeitungsphase}
                    />
                    <PhaseDisplay
                      title="Sicherung"
                      aktionen={lessonPlan.sicherungsphase}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 border-t p-4">
                  <IterationInput
                    value={iterationFeedback}
                    onChange={setIterationFeedback}
                    onIterate={iterateLessonPlan}
                    loading={loading}
                    placeholder="Feedback zum Entwurf..."
                  />
                </div>
              </div>

              {worksheet && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="bg-gray-50 border-b px-6 py-4">
                    <h3 className="font-bold text-gray-700">Arbeitsblatt</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {worksheet.varianten.map((v, i) => (
                      <div key={i} className="space-y-4">
                        {v.variante && (
                          <h4 className="font-bold border-b pb-1">
                            {v.variante}
                          </h4>
                        )}
                        {v.aufgaben.map((aufg, j) => (
                          <div
                            key={j}
                            className="p-4 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold">
                                Aufgabe {j + 1}
                              </span>
                              <span className="text-xs text-gray-500">
                                {aufg.dauer} Min.
                              </span>
                            </div>
                            <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
                              <ReactMarkdown>
                                {aufg.aufgabenstellung}
                              </ReactMarkdown>
                            </div>
                            <div className="text-xs text-gray-500 bg-white p-2 border rounded prose prose-xs max-w-none">
                              <strong className="block mb-1 text-gray-700">
                                Musterlösung:
                              </strong>
                              <ReactMarkdown>
                                {aufg.musterloesung}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 border-t p-4">
                    <IterationInput
                      value={iterationFeedback}
                      onChange={setIterationFeedback}
                      onIterate={iterateWorksheet}
                      loading={loading}
                      placeholder="Feedback zum Arbeitsblatt..."
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[100%] bg-white rounded-xl shadow-sm border border-dashed flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="p-4 bg-gray-50 rounded-full">
                <Wand2 size={48} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  Noch kein Entwurf generiert
                </p>
                <p className="text-sm">
                  Fülle die Details links aus und klicke auf "Entwurf
                  erstellen".
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PhaseDisplay({
  title,
  aktionen,
}: {
  title: string
  aktionen: Unterrichtsablauf['einstiegsphase']
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-2">
        {aktionen.map((a, i) => (
          <div
            key={i}
            className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="w-12 shrink-0 font-mono text-blue-600 font-bold text-center border-r pr-4">
              {a.dauer}'
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm">{a.ziel}</p>
              <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                <ReactMarkdown>{a.beschreibung}</ReactMarkdown>
              </div>
              {a.material && (
                <p className="text-xs text-gray-400 italic">
                  Material: {a.material}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IterationInput({
  value,
  onChange,
  onIterate,
  loading,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onIterate: () => void
  loading: boolean
  placeholder: string
}) {
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onIterate()}
      />
      <button
        onClick={onIterate}
        disabled={loading || !value.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
      >
        {loading ? (
          <RefreshCw className="animate-spin" size={16} />
        ) : (
          <RefreshCw size={16} />
        )}
        Iterieren
      </button>
    </div>
  )
}
