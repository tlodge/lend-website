'use client'

import { useState, useRef, useCallback } from 'react'
import { Mic, Square, RotateCcw, Download, Send } from 'lucide-react'
import { saveStory } from '@/lib/db'
import { downloadBlob } from '@/lib/download'
import { ensureTitle, blobToDataUrl, submitStoryToServer } from '@/lib/submitStory'
import styles from './Capture.module.css'

interface Props {
  onSaved: () => void
}

export default function AudioCapture({ onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [converting, setConverting] = useState(false)
  const [duration, setDuration] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasContent = audioBlob !== null
  const busy = saving || submitting

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setRecording(true)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch {
      alert('Could not access your microphone. Please allow microphone access and try again.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setDuration(0)
  }

  async function handleSave() {
    if (!hasContent || !audioBlob || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSaving(true)
    try {
      const dataUrl = await blobToDataUrl(audioBlob)
      await saveStory({
        id: crypto.randomUUID(),
        type: 'audio',
        title: storyTitle,
        content: dataUrl,
        createdAt: new Date().toISOString(),
        submitted: false,
      })
      setTitle('')
      reset()
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit() {
    if (!hasContent || !audioBlob || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSubmitting(true)
    try {
      const dataUrl = await blobToDataUrl(audioBlob)
      const result = await submitStoryToServer({
        id: crypto.randomUUID(),
        type: 'audio',
        title: storyTitle,
        content: dataUrl,
        createdAt: new Date().toISOString(),
      })
      setToast(result.message)
      setTimeout(() => setToast(null), 4000)
      setTitle('')
      reset()
      onSaved()
    } catch {
      alert('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className={styles.capturePanel}>
      {toast && <div className={styles.toast}>{toast}</div>}
      <label className={styles.label} htmlFor="audio-title">
        Story Title
      </label>
      <input
        id="audio-title"
        className={styles.input}
        type="text"
        placeholder="Give your story a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.recorderArea}>
        {!audioUrl ? (
          <>
            <div className={`${styles.recorderCircle} ${recording ? styles.recording : ''}`}>
              {recording ? (
                <button
                  className={styles.recorderBtn}
                  onClick={stopRecording}
                  aria-label="Stop recording"
                >
                  <Square size={32} />
                </button>
              ) : (
                <button
                  className={styles.recorderBtn}
                  onClick={startRecording}
                  aria-label="Start recording"
                >
                  <Mic size={32} />
                </button>
              )}
            </div>
            <p className={styles.recorderHint}>
              {recording ? `Recording... ${formatTime(duration)}` : 'Tap to start recording'}
            </p>
          </>
        ) : (
          <>
            <audio controls src={audioUrl} className={styles.mediaPlayer}>
              Your browser does not support audio playback.
            </audio>
            <div className={styles.mediaActions}>
              <button className={styles.resetBtn} onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" />
                Record Again
              </button>
              {audioBlob && (
                <button
                  className={styles.downloadBtn}
                  disabled={converting}
                  onClick={async () => {
                    setConverting(true)
                    try {
                      await downloadBlob(audioBlob, `${title.trim() || 'story'}.mp3`)
                    } catch (e) {
                      console.error('Conversion failed', e)
                      alert('Download conversion failed. Please try again.')
                    } finally {
                      setConverting(false)
                    }
                  }}
                >
                  <Download size={16} aria-hidden="true" />
                  {converting ? 'Converting to MP3...' : 'Download MP3'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className={styles.actionRow}>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!hasContent || busy}
        >
          {saving ? 'Saving...' : 'Save Story'}
        </button>
        {/*<button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!hasContent || busy}
        >
          <Send size={16} aria-hidden="true" />
          {submitting ? 'Submitting...' : 'Submit Story'}
        </button>*/}
      </div>
    </div>
  )
}
