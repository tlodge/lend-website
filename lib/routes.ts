import blogData from "../app/data/blogs.json"
import type { BlogData } from "./types"

export interface Crumb {
  label: string;
  href: string;
}

// Page titles and their parent pages, used for breadcrumbs and back links
const routes: Record<string, { label: string; parent?: string }> = {
  "/": { label: "Home" },
  "/about": { label: "What is LEND?", parent: "/" },
  "/leap": { label: "Lived Experience Advisory Panel", parent: "/about" },
  "/participate": { label: "Get involved", parent: "/" },
  "/participate/test-lend": { label: "Help us test LEND", parent: "/participate" },
  "/collect": { label: "Share your story", parent: "/participate" },
  "/team": { label: "Our team", parent: "/" },
  "/findings": { label: "Findings", parent: "/" },
  "/contact": { label: "Contact", parent: "/" },
  "/news": { label: "News", parent: "/" },
  "/search": { label: "Search", parent: "/" },
  "/resources": { label: "Resources", parent: "/" },
  "/stories": { label: "Stories", parent: "/" },
  "/donate": { label: "Donate", parent: "/" },
}

const titleCase = (segment: string) =>
  decodeURIComponent(segment).replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase())

const lookup = (path: string): { label: string; parent?: string } => {
  if (routes[path]) return routes[path]

  const blogMatch = path.match(/^\/blog\/([^/]+)$/)
  if (blogMatch) {
    const post = (blogData as BlogData).find((blog) => blog.id === blogMatch[1])
    return { label: post?.title ?? "News post", parent: "/news" }
  }

  // Unknown pages fall back to their URL, nested under the parent path
  const segments = path.split("/").filter(Boolean)
  return {
    label: titleCase(segments[segments.length - 1] ?? ""),
    parent: segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/",
  }
}

/** Trail from Home to the given path, inclusive */
export function getTrail(pathname: string): Crumb[] {
  const path = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname
  const trail: Crumb[] = []
  let current: string | undefined = path
  const seen = new Set<string>()
  while (current && !seen.has(current)) {
    seen.add(current)
    const route = lookup(current)
    trail.unshift({ label: route.label, href: current })
    current = route.parent
  }
  return trail
}
