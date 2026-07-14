import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import BlogGrid from "../../components/BlogGrid";
import Footer from "../../components/Footer";

const NewsPage = () => {
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection
          backgroundImage="blogback.svg"
          isPattern={false}
          content="Latest <strong>news</strong> and project stories"
        />
        <BlogGrid />
      </div>
      <Footer />
    </>
  );
};

export default NewsPage;
