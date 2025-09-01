import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import BlogPost from "../../../components/BlogPost"
import { notFound } from "next/navigation"
import blogData from "../../data/blogs.json"
import type { BlogData } from "../../../lib/types"

interface BlogPageProps {
  params: Promise<{
    id: string
  }>
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const { id } = await params;
  const blogs: BlogData = blogData as BlogData;
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    notFound()
  }

  return (
    <>
      <Header />
      <BlogPost blog={blog} />
      <Footer />
    </>
  )
}

export default BlogPage
