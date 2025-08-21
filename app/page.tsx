import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import QuestionsSection from "../components/QuestionsSection"
import ContentSection from "../components/ContentSection"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HeroSection />
        <QuestionsSection />
        <ContentSection />
      </div>
      <Footer />
    </main>
  )
}

