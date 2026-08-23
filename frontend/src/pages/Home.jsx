import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import TrustBadges from "../components/TrustBadges";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <TrustBadges />
      <FeaturedProducts />
    </>
  );
}
