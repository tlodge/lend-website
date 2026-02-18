import type { Story } from './db'
import { convertToMp3, convertToMp4 } from './convert'

/**
 * Download a story from IndexedDB in a user-friendly format.
 * Audio → MP3, Video → MP4, Text → TXT
 * Returns a promise so callers can show a loading state.
 */
export async function downloadStory(
  story: Story,
  onProgress?: (ratio: number) => void
): Promise<void> {
  if (story.type === 'text') {
    const blob = new Blob([story.content], { type: 'text/plain' })
    triggerDownload(blob, `${sanitize(story.title)}.txt`)
  } else if (story.type === 'audio') {
    const sourceBlob = dataUrlToBlob(story.content)
    const mp3 = await convertToMp3(sourceBlob, onProgress)
    triggerDownload(mp3, `${sanitize(story.title)}.mp3`)
  } else if (story.type === 'video') {
    const sourceBlob = dataUrlToBlob(story.content)
    const mp4 = await convertToMp4(sourceBlob, onProgress)
    triggerDownload(mp4, `${sanitize(story.title)}.mp4`)
  }
}

/**
 * Download a raw blob, converting audio/video to friendly formats.
 */
export async function downloadBlob(
  blob: Blob,
  filename: string,
  onProgress?: (ratio: number) => void
): Promise<void> {
  if (blob.type.startsWith('audio/')) {
    const mp3 = await convertToMp3(blob, onProgress)
    const name = filename.replace(/\.\w+$/, '.mp3')
    triggerDownload(mp3, name)
  } else if (blob.type.startsWith('video/')) {
    const mp4 = await convertToMp4(blob, onProgress)
    const name = filename.replace(/\.\w+$/, '.mp4')
    triggerDownload(mp4, name)
  } else {
    triggerDownload(blob, filename)
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mime })
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'story'
}
