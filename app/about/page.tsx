import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import AboutContent from "../../components/AboutContent"
import Footer from "../../components/Footer"

export default function About() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HeroSection image="trees.svg" backgroundImage="pattern.png" isPattern={true} content={`Dementia affects over <strong>850,000</strong> people in the UK and <strong>700,000</strong> carers, often leading to loss of identity, reduced quality of life, and "excess disability".`} />
        <AboutContent />
      </div>
      <Footer />
    </main>
  )
}
