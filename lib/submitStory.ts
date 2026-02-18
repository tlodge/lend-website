import { saveStory, type Story } from '@/lib/db'

/**
 * Ensures a title exists (prompts if not), then returns the title.
 * Returns null if the user cancels.
 */
export function ensureTitle(
  currentTitle: string,
  setTitle: (t: string) => void
): string | null {
  let storyTitle = currentTitle.trim()
  if (!storyTitle) {
    const entered = prompt('Please give your story a title:')
    if (!entered || !entered.trim()) return null
    storyTitle = entered.trim()
    setTitle(storyTitle)
  }
  return storyTitle
}

/**
 * Convert a Blob to a data URL.
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

/**
 * Submit a story to the server API. Saves locally with submitted=true, then POSTs.
 */
export async function submitStoryToServer(story: Omit<Story, 'submitted'>): Promise<{ success: boolean; message: string }> {
  // Save locally with submitted = true
  await saveStory({ ...story, submitted: true })

  // POST to the submit API
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
    throw new Error('Submission failed')
  }

  const data = await res.json()
  return { success: true, message: data.message || 'Story submitted successfully!' }
}
