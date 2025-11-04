import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import ExperimentGrid from "../../components/ExperimentGrid"
import Footer from "../../components/Footer"

const ParticipatePage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection backgroundImage="blogback.svg" isPattern={false} content="Throughout this project we're keen to learn as much as we can about the experiences of living with dementia or caring for someone with dementia. This page will contain all of the workshops, prototypes and studies that we're organising to help with this.  Please share widely." />
        <ExperimentGrid />
      </div>
      <Footer />
    </>
  )
}

export default ParticipatePage
