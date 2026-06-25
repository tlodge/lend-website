import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Collect from "../../components/Collect"
import Footer from "../../components/Footer"

const ParticipatePage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection backgroundImage="blogback.svg" isPattern={false} content="Do you have a story that you would like to share?" />
        <Collect/>
      </div>
      <Footer />
    </>
  )
}

export default ParticipatePage
