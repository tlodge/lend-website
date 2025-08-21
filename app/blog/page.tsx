import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import BlogGrid from "../../components/BlogGrid"
import Footer from "../../components/Footer"

const BlogPage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection />
        <BlogGrid />
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
