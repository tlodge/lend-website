import Link from "next/link"

const directDownloadPath = "/dce/download"
const documentPath = "/documents/WP1.5%20Participant%20Information%20Sheet%20v2.0.docx"

export default function DcePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow)",
          padding: "48px 32px",
        }}
      >
        <p style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          DCE
        </p>
        <h1 style={{ marginTop: "14px", fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.1, color: "var(--text)" }}>
          Download the Participant Information Sheet
        </h1>
        <p style={{ marginTop: "18px", fontSize: "1.05rem", color: "var(--muted)", maxWidth: "60ch" }}>
          Use the button below to download the Word document. 
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "28px" }}>
          <a
            href={documentPath}
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 22px",
              borderRadius: "999px",
              background: "var(--accent)",
              color: "white",
              fontWeight: 700,
            }}
          >
            Download file
          </a>
          
        </div>
      </div>
    </main>
  )
}