import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"

export default function Resources() {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection
          title="Resources"
          subtitle="Helpful materials and tools for people living with dementia and their carers"
        />
        <main style={{ padding: "60px 0", backgroundColor: "#F5F9F7" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "#333" }}>Coming Soon</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#666", marginBottom: "20px" }}>
              We are currently developing a comprehensive collection of resources to support people living with dementia
              and their families.
            </p>
            <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#666" }}>
              This section will include practical guides, helpful tools, and curated links to trusted organizations and
              support services.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
