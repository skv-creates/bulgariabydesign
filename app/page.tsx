import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { VideoSection } from "./components/VideoSection";
import { Manifest } from "./components/Manifest";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Gallery />
        <VideoSection />
        <Manifest />
      </main>
      <Footer />
    </>
  );
}
