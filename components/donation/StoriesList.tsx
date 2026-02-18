'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Type,
  Mic,
  Video,
  Trash2,
  Send,
  Eye,
  X,
  CheckCircle,
  Loader2,
  Download,
} from 'lucide-react'
import { getAllStories, deleteStory, saveStory, type Story } from '@/lib/db'
import { downloadStory } from '@/lib/download'
import styles from './StoriesList.module.css'

export default function StoriesList() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingStory, setViewingStory] = useState<Story | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getAllStories()
    setStories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleDelete(story: Story) {
    if (!confirm(`Delete "${story.title}"? This cannot be undone.`)) return
    await deleteStory(story.id)
    if (viewingStory?.id === story.id) setViewingStory(null)
    await load()
    showToast('Story deleted.')
  }

  async function handleSubmit(story: Story) {
    setSubmitting(story.id)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: story.id,
          type: story.type,
          title: story.title,
          content: story.content,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }
      await saveStory({ ...story, submitted: true })
      await load()
      showToast('Story submitted successfully!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed'
      alert(`Failed to submit: ${msg}`)
    } finally {
      setSubmitting(null)
    }
  }

  async function handleDownload(story: Story) {
    setDownloading(story.id)
    try {
      await downloadStory(story)
    } catch (err) {
      console.error('Download failed', err)
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const typeIcon = (type: Story['type']) => {
    switch (type) {
      case 'text':
        return <Type size={18} aria-hidden="true" />
      case 'audio':
        return <Mic size={18} aria-hidden="true" />
      case 'video':
        return <Video size={18} aria-hidden="true" />
    }
  }

  const typeLabel = (type: Story['type']) => {
    switch (type) {
      case 'text':
        return 'Text'
      case 'audio':
        return 'Audio'
      case 'video':
        return 'Video'
    }
  }

  if (loading) {
    return (
      <div className={styles.empty}>
        <Loader2 size={32} className={styles.spinner} aria-hidden="true" />
        <p>Loading stories...</p>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No stories yet</p>
        <p className={styles.emptyHint}>
          Go to the Capture page to write, record, or film your first story.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.list}>
        {stories.map((story) => (
          <div key={story.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.cardTypeIcon}>{typeIcon(story.type)}</div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{story.title}</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>{typeLabel(story.type)}</span>
                  <span className={styles.cardDate}>
                    {new Date(story.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {story.submitted && (
                    <span className={styles.submittedBadge}>
                      <CheckCircle size={14} aria-hidden="true" />
                      Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.viewBtn}
                onClick={() => setViewingStory(story)}
                aria-label={`View ${story.title}`}
              >
                <Eye size={16} aria-hidden="true" />
                View
              </button>
              <button
                className={styles.viewBtn}
                onClick={() => handleDownload(story)}
                disabled={downloading === story.id}
                aria-label={`Download ${story.title}`}
              >
                {downloading === story.id ? (
                  <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                ) : (
                  <Download size={16} aria-hidden="true" />
                )}
                {downloading === story.id
                  ? story.type === 'video' ? 'Converting to MP4...' : story.type === 'audio' ? 'Converting to MP3...' : 'Downloading...'
                  : story.type === 'video' ? 'Download MP4' : story.type === 'audio' ? 'Download MP3' : 'Download'}
              </button>
              {!story.submitted && (
                <button
                  className={styles.submitBtn}
                  onClick={() => handleSubmit(story)}
                  disabled={submitting === story.id}
                  aria-label={`Submit ${story.title}`}
                >
                  {submitting === story.id ? (
                    <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                  ) : (
                    <Send size={16} aria-hidden="true" />
                  )}
                  {submitting === story.id ? 'Submitting...' : 'Submit'}
                </button>
              )}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(story)}
                aria-label={`Delete ${story.title}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewingStory && (
        <div
          className={styles.overlay}
          onClick={() => setViewingStory(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing: ${viewingStory.title}`}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{viewingStory.title}</h2>
              <div className={styles.modalHeaderActions}>
                <button
                  className={styles.modalDownloadBtn}
                  onClick={() => handleDownload(viewingStory)}
                  disabled={downloading === viewingStory.id}
                  aria-label="Download this story"
                >
                  {downloading === viewingStory.id ? (
                    <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
                  ) : (
                    <Download size={18} aria-hidden="true" />
                  )}
                </button>
                <button
                  className={styles.closeBtn}
                  onClick={() => setViewingStory(null)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              {viewingStory.type === 'text' && (
                <div className={styles.textContent}>{viewingStory.content}</div>
              )}
              {viewingStory.type === 'audio' && (
                <audio controls src={viewingStory.content} className={styles.mediaFull}>
                  Your browser does not support audio playback.
                </audio>
              )}
              {viewingStory.type === 'video' && (
                <video controls src={viewingStory.content} className={styles.mediaFull}>
                  Your browser does not support video playback.
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  )
}
