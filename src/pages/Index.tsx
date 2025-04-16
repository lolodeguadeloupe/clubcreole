import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import Activities from "@/components/Activities";
import { Advantages } from "@/components/Advantages";
import { Pricing } from "@/components/Pricing";
import { ClientReviews } from "@/components/ClientReviews";
import { ClubCyclone } from "@/components/ClubCyclone";
import { Footer } from "@/components/Footer";
import { PartnerRestaurants } from "@/components/PartnerRestaurants";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Activities />
        <Advantages />
        <PartnerRestaurants />
        <ClientReviews />
        <Pricing />
        <ClubCyclone />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
