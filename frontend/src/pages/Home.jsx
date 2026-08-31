import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import NewArrivals from "../components/NewArrivals";
import TrustBadges from "../components/TrustBadges";
import Testimonials from "../components/Testimonials";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <TrustBadges />
      </Reveal>
      <FeaturedProducts />
      <NewArrivals />
      <Testimonials />
    </>
  );
}
