import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"
import TeamContent from "@/components/TeamContent"

export default function Contact() {
    return (
        <>
            <Header />
            <div className="content-container">
                <HeroSection backgroundImage="pattern.png" isPattern={true} content=" We are a mix of academics, clinical psychologists, psychiatrists, economists, statisticians,
              technologists, and people with lived experience of dementia. The project lead is Professor Martin Orrell,
              who is the Director of the Institute of  Mental Health at the University of Nottingham. " />
                <main style={{ padding: "60px 60px", minHeight: "calc(100vh - 480px)", backgroundColor: "#f5f9f7" }}>

                    <TeamContent />


                </main>
            </div>
            <Footer />
        </>
    )
}
