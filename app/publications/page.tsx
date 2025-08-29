import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"

export default function Publications() {
  const publications = [
    {
      title: "Lived Experience Narratives in Dementia Care: A Systematic Review",
      authors: "Harding, T., Smith, J., & Williams, K.",
      journal: "Journal of Dementia Care",
      year: "2024",
      volume: "32",
      issue: "4",
      pages: "245-267",
      doi: "10.1080/13607863.2024.1234567",
    },
    {
      title: "The Role of Storytelling in Supporting Dementia Carers: Qualitative Insights",
      authors: "Williams, K., Harding, T., Brown, M., & Davis, L.",
      journal: "International Journal of Geriatric Psychiatry",
      year: "2024",
      volume: "39",
      issue: "2",
      pages: "156-172",
      doi: "10.1002/gps.5234",
    },
    {
      title: "Digital Platforms for Sharing Dementia Experiences: User Perspectives and Design Considerations",
      authors: "Smith, J., Harding, T., & Thompson, R.",
      journal: "Dementia and Geriatric Cognitive Disorders",
      year: "2023",
      volume: "52",
      issue: "3",
      pages: "189-203",
      doi: "10.1159/000531234",
    },
    {
      title: "Co-designing Resources with People Living with Dementia: Lessons from the LEND Project",
      authors: "Harding, T., Williams, K., Johnson, P., & Miller, S.",
      journal: "Research Involvement and Engagement",
      year: "2023",
      volume: "9",
      issue: "1",
      pages: "45",
      doi: "10.1186/s40900-023-00456-7",
    },
    {
      title: "Narrative Medicine and Dementia: Building Empathy Through Shared Stories",
      authors: "Brown, M., Davis, L., Harding, T., & Wilson, A.",
      journal: "Medical Humanities",
      year: "2023",
      volume: "49",
      issue: "2",
      pages: "234-241",
      doi: "10.1136/medhum-2022-012456",
    },
  ]

  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection backgroundImage="pattern.png" isPattern={true} content="<strong>Research outputs</strong> from the <strong>LEND</strong> project and related work" />
        <main style={{ padding: "60px 0", backgroundColor: "#F5F9F7" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "40px", color: "#333" }}>Recent Publications</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              {publications.map((pub, index) => (
                <article
                  key={index}
                  style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #5B85C2",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      marginBottom: "15px",
                      color: "#333",
                      lineHeight: "1.4",
                    }}
                  >
                    {pub.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "16px",
                      color: "#5B85C2",
                      marginBottom: "10px",
                      fontWeight: "500",
                    }}
                  >
                    {pub.authors}
                  </p>

                  <p
                    style={{
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    {pub.journal}, {pub.year}, {pub.volume}({pub.issue}), {pub.pages}
                  </p>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#888",
                      fontFamily: "monospace",
                    }}
                  >
                    DOI: {pub.doi}
                  </p>
                </article>
              ))}
            </div>

            <div
              style={{
                marginTop: "50px",
                padding: "30px",
                backgroundColor: "#CED5DE",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#333" }}>Stay Updated</h3>
              <p style={{ fontSize: "16px", color: "#666" }}>
                More publications from the LEND project are in development. Check back regularly for the latest research
                outputs.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
