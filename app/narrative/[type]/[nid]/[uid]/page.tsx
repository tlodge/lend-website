import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { promises as fs } from "node:fs"
import path from "node:path"

type NarrativeType = "video" | "audio" | "text" | "image"

type NarrativeEntry = {
  id: string
  type: NarrativeType
  title: string
  summary: string
  description?: string
  ogImage?: string
  mediaUrl?: string
  source?: string
}

type RouteParams = {
  type: string
  nid: string
  uid: string
}

const THUMBNAIL_BY_TYPE: Record<NarrativeType, string> = {
  video: "/og/video.png",
  audio: "/og/audio.png",
  text: "/og/text.png",
  image: "/og/image.png"
}

const FALLBACKS: Record<NarrativeType, Omit<NarrativeEntry, "id" | "type">> = {
  video: {
    title: "Video narrative",
    summary: "A short video narrative selected for this participant.",
    description: "Open to see the summary and play the video.",
    ogImage: THUMBNAIL_BY_TYPE.video,
    mediaUrl: "/narratives/lend-p/video/0001/Romael and Ronald - No one told me,  the power of music and dementia.mp4"
  },
  audio: {
    title: "Audio narrative",
    summary: "A short audio narrative selected for this participant.",
    description: "Open to see the summary and listen to the audio.",
    ogImage: THUMBNAIL_BY_TYPE.audio
  },
  text: {
    title: "Text narrative",
    summary: "A written narrative selected for this participant.",
    description: "Open to see the summary and read the narrative.",
    ogImage: THUMBNAIL_BY_TYPE.text
  },
  image: {
    title: "Image narrative",
    summary: "An image-led narrative selected for this participant.",
    description: "Open to see the summary and view the image.",
    ogImage: THUMBNAIL_BY_TYPE.image
  }
}

function asNarrativeType(value: string): NarrativeType {
  if (value === "video" || value === "audio" || value === "text" || value === "image") {
    return value
  }
  return "video"
}

async function loadCollection(): Promise<NarrativeEntry[]> {
  const filePath = path.join(process.cwd(), "public", "narratives", "collections.json")
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    if (!raw.trim()) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as NarrativeEntry[]) : []
  } catch {
    return []
  }
}

async function getNarrative(type: NarrativeType, nid: string): Promise<NarrativeEntry> {
  const entries = await loadCollection()
  const found = entries.find((entry) => entry.type === type && entry.id === nid)

  if (found) {
    return {
      ...FALLBACKS[type],
      ...found,
      type,
      id: nid,
      ogImage: found.ogImage || THUMBNAIL_BY_TYPE[type]
    }
  }

  return {
    id: nid,
    type,
    ...FALLBACKS[type],
    ogImage: THUMBNAIL_BY_TYPE[type]
  }
}

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (envUrl) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`
  }

  const h = await headers()
  const host = h.get("host") || "localhost:3000"
  const proto = h.get("x-forwarded-proto") || "http"
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const resolvedParams = await params
  const type = asNarrativeType(resolvedParams.type)
  const narrative = await getNarrative(type, resolvedParams.nid)
  const baseUrl = await getBaseUrl()
  const pageUrl = `${baseUrl}/narrative/${type}/${encodeURIComponent(resolvedParams.nid)}/${encodeURIComponent(resolvedParams.uid)}`
  const ogImage = `${baseUrl}${THUMBNAIL_BY_TYPE[type]}`

  return {
    title: `${narrative.title} | LEND narrative`,
    description: narrative.description || narrative.summary,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: narrative.title,
      description: narrative.description || narrative.summary,
      type: "article",
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 1080,
          height: 1080,
          alt: `${type} narrative preview`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: narrative.title,
      description: narrative.description || narrative.summary,
      images: [ogImage]
    }
  }
}

export default async function NarrativeSharePage({ params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params
  const type = asNarrativeType(resolvedParams.type)
  const narrative = await getNarrative(type, resolvedParams.nid)
  const mediaHref = narrative.mediaUrl || ""

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem 1rem" }}>
      <section
        style={{
          width: "min(760px, 100%)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow)",
          padding: "2rem",
          display: "grid",
          gap: "1rem"
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
          Participant ID: {resolvedParams.uid} | Narrative ID: {resolvedParams.nid} | Type: {type}
        </p>
        <h1 style={{ margin: 0, fontSize: "1.8rem", lineHeight: 1.2 }}>{narrative.title}</h1>
        <p style={{ margin: 0, color: "var(--text)" }}>{narrative.summary}</p>

        {mediaHref ? (
          <Link
            href={mediaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifySelf: "start",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0.75rem 1.2rem",
              borderRadius: "12px",
              background: "var(--accent)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            {type === "video" ? "Play video" : type === "audio" ? "Play audio" : type === "image" ? "View image" : "Read narrative"}
          </Link>
        ) : (
          <p style={{ color: "var(--muted)", margin: 0 }}>
            No media file is linked yet for this narrative in collections.json.
          </p>
        )}
      </section>
    </main>
  )
}
