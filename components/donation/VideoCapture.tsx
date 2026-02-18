'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Video, Square, RotateCcw, Download, Send } from 'lucide-react'
import { saveStory } from '@/lib/db'
import { downloadBlob } from '@/lib/download'
import { ensureTitle, blobToDataUrl, submitStoryToServer } from '@/lib/submitStory'
import styles from './Capture.module.css'

interface Props {
  onSaved: () => void
}

export default function VideoCapture({ onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [converting, setConverting] = useState(false)
  const [duration, setDuration] = useState(0)
  const [streamActive, setStreamActive] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const liveVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const hasContent = videoBlob !== null
  const busy = saving || submitting

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStreamActive(false)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      setStreamActive(true)
    } catch {
      alert(
        'Could not access your camera/microphone. Please allow access and try again.'
      )
    }
  }, [])

  useEffect(() => {
    if (streamActive && liveVideoRef.current && streamRef.current) {
      liveVideoRef.current.srcObject = streamRef.current
    }
  }, [streamActive])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setVideoBlob(blob)
      setVideoUrl(URL.createObjectURL(blob))
      stopStream()
    }

    mediaRecorder.start()
    setRecording(true)
    setDuration(0)
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
  }, [stopStream])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  function reset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setVideoBlob(null)
    setDuration(0)
    stopStream()
  }

  useEffect(() => {
    return () => {
      stopStream()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stopStream])

  async function handleSave() {
    if (!hasContent || !videoBlob || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSaving(true)
    try {
      const dataUrl = await blobToDataUrl(videoBlob)
      await saveStory({
        id: crypto.randomUUID(),
        type: 'video',
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
    if (!hasContent || !videoBlob || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSubmitting(true)
    try {
      const dataUrl = await blobToDataUrl(videoBlob)
      const result = await submitStoryToServer({
        id: crypto.randomUUID(),
        type: 'video',
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
      <label className={styles.label} htmlFor="video-title">
        Story Title
      </label>
      <input
        id="video-title"
        className={styles.input}
        type="text"
        placeholder="Give your story a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.recorderArea}>
        {!videoUrl ? (
          <>
            {!streamActive ? (
              <div className={styles.recorderCircle}>
                <button
                  className={styles.recorderBtn}
                  onClick={startCamera}
                  aria-label="Start camera"
                >
                  <Video size={32} />
                </button>
              </div>
            ) : (
              <div className={styles.videoPreviewWrapper}>
                <video
                  ref={liveVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={styles.videoPreview}
                />
                {recording && (
                  <div className={styles.recordingBadge}>
                    REC {formatTime(duration)}
                  </div>
                )}
              </div>
            )}

            {streamActive && !recording && (
              <button className={styles.startRecBtn} onClick={startRecording}>
                Start Recording
              </button>
            )}
            {recording && (
              <button className={styles.stopRecBtn} onClick={stopRecording}>
                <Square size={16} aria-hidden="true" />
                Stop Recording
              </button>
            )}
            {!streamActive && !recording && (
              <p className={styles.recorderHint}>Tap to open camera</p>
            )}
          </>
        ) : (
          <>
            <video
              controls
              src={videoUrl}
              className={styles.videoPreview}
            >
              Your browser does not support video playback.
            </video>
            <div className={styles.mediaActions}>
              <button className={styles.resetBtn} onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" />
                Record Again
              </button>
              {videoBlob && (
                <button
                  className={styles.downloadBtn}
                  disabled={converting}
                  onClick={async () => {
                    setConverting(true)
                    try {
                      await downloadBlob(videoBlob, `${title.trim() || 'story'}.mp4`)
                    } catch (e) {
                      console.error('Conversion failed', e)
                      alert('Download conversion failed. Please try again.')
                    } finally {
                      setConverting(false)
                    }
                  }}
                >
                  <Download size={16} aria-hidden="true" />
                  {converting ? 'Converting to MP4...' : 'Download MP4'}
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
       {/*} <button
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
