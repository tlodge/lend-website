import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"
import Resources from "../../components/Resources"

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection
          content="Our searchable library of <strong>resources and materials</strong> from the LEND project"
          backgroundImage="pattern.png" isPattern={true}
        />
      <Resources />
      </div>
      <Footer />
    </>
  )
}
