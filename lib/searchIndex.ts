import { readFileSync } from "fs"
import { join } from "path"
import blogData from "../app/data/blogs.json"
import peopleData from "../app/data/people.json"
import publicationsData from "../app/data/publications.json"
import involvementData from "../app/data/involvement.json"
import type { BlogData, InvolvementData, PeopleData, PublicationData } from "./types"

export interface SearchEntry {
  title: string;
  href: string;
  category: "Page" | "Get involved" | "News" | "Team" | "Findings";
  description: string;
  body?: string;
  // Extra words to match on; searched but never shown in results
  keywords?: string;
}

// Pages are described by hand so results read well; keep in step with page content.
const pages: SearchEntry[] = [
  {
    title: "Home",
    href: "/",
    category: "Page",
    description: "Real stories. Shared understanding. LEND is exploring how real-life stories about dementia can support people living with dementia, their families, friends and wider support networks.",
    keywords: "Welcome to LEND video overview project lead team contact get involved latest news NIHR funding",
  },
  {
    title: "What is LEND?",
    href: "/about",
    category: "Page",
    description: "LEND stands for Lived Experience Narratives in Dementia. Why stories are important for dementia support, the aims of LEND, and how we work alongside people with lived experience.",
    keywords: "Sharing stories can improve quality of life for people affected by dementia. Improve understanding of dementia, foster empowerment and reduce loneliness, help others to find meaning. Lived Experience Advisory Panel LEAP. Gaps in stories from people from ethnic minorities, people with rarer dementias such as young-onset dementia, and the LGBTQIA+ community. Carers family friends.",
  },
  {
    title: "Get involved",
    href: "/participate",
    category: "Page",
    description: "Ways to get involved in LEND if you are someone with a diagnosis of dementia, or an informal carer such as a family member, partner or friend.",
    keywords: "Take part participate volunteer study survey share your story discrete choice experiment test LEND",
  },
  {
    title: "Help us test LEND",
    href: "/participate/test-lend",
    category: "Page",
    description: "Take part in our study looking at the impact of LEND. Find out who is eligible, what you would need to do and what else you need to know.",
    keywords: "Trial study eligibility eligible testing group non-testing group randomly 3 months follow-up interviews 12 18 months voluntary withdraw device internet email phone diagnosis carer supporter register",
  },
  {
    title: "Our team",
    href: "/team",
    category: "Page",
    description: "We are a mix of academics, clinical psychologists, psychiatrists, economists, statisticians, technologists, and people with lived experience of dementia.",
    keywords: "Project lead Professor Martin Orrell, Director of the Institute of Mental Health at the University of Nottingham. Researchers people staff",
  },
  {
    title: "Findings",
    href: "/findings",
    category: "Page",
    description: "Publications, posters and other outputs from the LEND project.",
    keywords: "Research results papers publications posters conference",
  },
  {
    title: "Contact us",
    href: "/contact",
    category: "Page",
    description: "Get in touch with the LEND research team at LEND@nottingham.ac.uk.",
    keywords: "Email contact questions address research team",
  },
  {
    title: "Share your story",
    href: "/collect",
    category: "Page",
    description: "LEND is creating a growing collection of stories describing people's experiences of dementia.",
    keywords: "Narratives narrative collection gift donate story caregivers carers people with dementia groups",
  },
  {
    title: "Lived Experience Advisory Panel (LEAP)",
    href: "/leap",
    category: "Page",
    description: "People with dementia and carers, both current and former, from a range of backgrounds and cultures, who help guide the direction of LEND.",
    keywords: "LEAP meetings sessions advisory panel lived experience",
  },
  {
    title: "News",
    href: "/news",
    category: "Page",
    description: "The latest news and updates from the LEND project.",
    keywords: "Updates blog programme meetings",
  },
]

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()

const readBlogContent = (contentFile: string) => {
  try {
    return stripMarkdown(readFileSync(join(process.cwd(), "public", contentFile), "utf8"))
  } catch {
    return ""
  }
}

export function buildSearchIndex(): SearchEntry[] {
  const involvement: SearchEntry[] = (involvementData as InvolvementData).map((option) => ({
    title: option.title,
    href: option.button.href.startsWith("/") ? option.button.href : "/participate",
    category: "Get involved",
    description: option.description,
    body: option.meta ?? "",
  }))

  const news: SearchEntry[] = (blogData as BlogData)
    .filter((blog) => blog.tags.includes("news"))
    .map((blog) => ({
      title: blog.title,
      href: `/blog/${blog.id}`,
      category: "News",
      description: stripHtml(blog.excerpt),
      body: [blog.subtitle, blog.author, blog.tags.join(" "), readBlogContent(blog.contentFile)].join(" "),
    }))

  const team: SearchEntry[] = (peopleData as PeopleData).map((person) => ({
    title: person.name,
    href: "/team",
    category: "Team",
    description: stripHtml(person.profile),
    body: person.institution,
  }))

  const findings: SearchEntry[] = (publicationsData as PublicationData).map((publication) => ({
    title: publication.title,
    href: "/findings",
    category: "Findings",
    description: [publication.authors, publication.venue ?? publication.journal, publication.year].filter(Boolean).join(" · "),
    body: publication.type,
  }))

  return [...pages, ...involvement, ...news, ...team, ...findings]
}
