

import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import AboutContent from "../components/AboutContent"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HeroSection image="trees.svg" backgroundImage="pattern.png" isPattern={true} content={`Real-life stories may bring comfort, guidance, and hope to carers and people living with dementia. We are working with those affected to create an online resources to share helpful experiences. We are funded by the <strong>National Institute for Health and Care Research (NIHR)</strong>.
`} />
        <AboutContent />
        
      </div>
      <Footer />
    </main>
  )
}

{/*export default function Home() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HeroSection content={`Real-life stories may bring comfort, guidance, and hope to carers and people living with dementia. We are
          working with those affected to create an online resource to share helpful experiences. We are funded by the
          <strong> National Institute for Health and Care Research (NIHR)</strong>. The study is sponsored by <strong>Nottinghamshire Healthcare NHS Trust</strong>.`} backgroundImage="pattern.png" isPattern={true} />
        <QuestionsSection />
        <ContentSection />
      </div>
      <Footer />
    </main>
  )
}*/}

