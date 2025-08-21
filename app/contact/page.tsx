import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"

export default function Contact() {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection title="Contact Us" subtitle="Get in touch with the LEND research team" />
        <main style={{ padding: "60px 0", backgroundColor: "#F5F9F7" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "#333" }}>Get in Touch</h2>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#5B85C2" }}>Research Team</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666", marginBottom: "10px" }}>
                  <strong>Email:</strong> lend.research@nottingham.ac.uk
                </p>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666" }}>
                  <strong>Phone:</strong> +44 (0)115 823 0000
                </p>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#5B85C2" }}>Address</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666" }}>
                  University of Nottingham
                  <br />
                  School of Health Sciences
                  <br />
                  Queen's Medical Centre
                  <br />
                  Nottingham NG7 2UH
                  <br />
                  United Kingdom
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#5B85C2" }}>Funding</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666" }}>
                  This project is funded by the National Institute for Health and Care Research (NIHR).
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
