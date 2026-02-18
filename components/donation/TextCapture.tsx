'use client'

import { useState } from 'react'
import { Download, Send } from 'lucide-react'
import { saveStory } from '@/lib/db'
import { downloadBlob } from '@/lib/download'
import { ensureTitle, submitStoryToServer } from '@/lib/submitStory'
import styles from './Capture.module.css'

interface Props {
  onSaved: () => void
}

export default function TextCapture({ onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const hasContent = text.trim().length > 0
  const busy = saving || submitting

  async function handleSave() {
    if (!hasContent || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSaving(true)
    try {
      await saveStory({
        id: crypto.randomUUID(),
        type: 'text',
        title: storyTitle,
        content: text.trim(),
        createdAt: new Date().toISOString(),
        submitted: false,
      })
      setTitle('')
      setText('')
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit() {
    if (!hasContent || busy) return
    const storyTitle = ensureTitle(title, setTitle)
    if (!storyTitle) return
    setSubmitting(true)
    try {
      const result = await submitStoryToServer({
        id: crypto.randomUUID(),
        type: 'text',
        title: storyTitle,
        content: text.trim(),
        createdAt: new Date().toISOString(),
      })
      setToast(result.message)
      setTimeout(() => setToast(null), 4000)
      setTitle('')
      setText('')
      onSaved()
    } catch {
      alert('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.capturePanel}>
      {toast && <div className={styles.toast}>{toast}</div>}
      <label className={styles.label} htmlFor="text-title">
        Story Title
      </label>
      <input
        id="text-title"
        className={styles.input}
        type="text"
        placeholder="Give your story a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className={styles.label} htmlFor="text-content">
        Your Story
      </label>
      <textarea
        id="text-content"
        className={styles.textarea}
        placeholder="Paste or type your story here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
      />
      <div className={styles.charCount}>
        {text.length.toLocaleString()} characters
      </div>
      <div className={styles.actionRow}>
        {hasContent && (
          <button
            className={styles.downloadBtn}
            onClick={() => {
              const blob = new Blob([text.trim()], { type: 'text/plain' })
              downloadBlob(blob, `${title.trim() || 'story'}.txt`)
            }}
          >
            <Download size={16} aria-hidden="true" />
            Download
          </button>
        )}
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
