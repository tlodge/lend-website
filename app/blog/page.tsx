import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import BlogGrid from "../../components/BlogGrid"
import Footer from "../../components/Footer"

const BlogPage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection backgroundImage="blogback.svg" isPattern={false} content="The <strong>LEND</strong> project blog and articles" />
        <BlogGrid />
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
