import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import PromoCards from "../components/PromoCards";
import FeaturedProducts from "../components/FeaturedProducts";
import NewArrivals from "../components/NewArrivals";
import TrustBadges from "../components/TrustBadges";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <PromoCards />
      </Reveal>
      <FeaturedProducts />
      <NewArrivals />
      <Reveal>
        <TrustBadges />
      </Reveal>
    </>
  );
}
