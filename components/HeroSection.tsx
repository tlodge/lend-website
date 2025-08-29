import Image from "next/image"
import styles from "./HeroSection.module.css"

interface HeroSectionProps {
  content?: string;
  image?: string;
  backgroundImage?: string;
  isPattern?: boolean;
}

const HeroSection = ({ content = "", image = "", backgroundImage = "", isPattern = false }: HeroSectionProps) => {
  const heroStyle = backgroundImage ? { 
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: isPattern ? 'auto' : 'cover',
    backgroundRepeat: isPattern ? 'repeat' : 'no-repeat'
  } : {};
  
  return (
    <section className={styles.hero} style={heroStyle}>
      {image && <Image src={image} alt="pattern" className={styles.tree} width={68} height={161}/>}
      <div className={styles.container}>
        <p className={styles.heroText} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  )
}

export default HeroSection
