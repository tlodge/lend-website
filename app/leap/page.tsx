import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import LEAPGrid from "../../components/LEAPGrid"
import Footer from "../../components/Footer"

const LEAPPage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection backgroundImage="blogback.svg" isPattern={false} content="LEAP <strong>Research Sessions</strong>" />
        <LEAPGrid />
      </div>
      <Footer />
    </>
  )
}

export default LEAPPage
