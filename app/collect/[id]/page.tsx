import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import Form from "../../../components/Form"
import formsData from "../../data/forms.json"
import type { FormsData } from "../../../lib/types"
import { notFound } from "next/navigation"
import Link from "next/link"

interface CollectPageProps {
  params: Promise<{
    id: string
  }>
}

const CollectPage = async ({ params }: CollectPageProps) => {
  const { id } = await params
  const forms: FormsData = formsData as FormsData
  const form = forms[id]

  if (!form) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="content-container">
        <div style={{ padding: "40px 40px 0" }}>
          <Link 
            href="/participate" 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#5b85c2",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "20px",
              transition: "opacity 0.2s"
            }}
            className="back-link"
          >
            ← Back to Participate
          </Link>
          <h1 style={{ 
            fontSize: "36px", 
            fontWeight: 700, 
            margin: "0 0 20px 0",
            color: "#1a1a1a"
          }}>
            {form.title}
          </h1>
        </div>
        <Form form={form} />
      </div>
      <Footer />
    </>
  )
}

export default CollectPage

