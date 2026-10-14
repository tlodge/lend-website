import Header from "../components/Header"
import HomeContent from "../components/HomeContent"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <HomeContent />
      </div>
      <Footer />
    </main>
  )
}
