import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import AboutContent from "../../components/AboutContent"
import Footer from "../../components/Footer"

export default function About() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HeroSection />
        <AboutContent />
      </div>
      <Footer />
    </main>
  )
}
