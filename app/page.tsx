import Hero from "@/components/sections/Hero";
import ServiceHighlight from "@/components/sections/ServiceHighlight";
import Stats from "@/components/sections/Stats";
import GalleryPreview from "@/components/sections/GalleryPreview";
import InstagramFeed from "@/components/sections/InstagramFeed";
import GoogleReviews from "@/components/sections/GoogleReviews";
import Team from "@/components/sections/Team";
import FAQ from "@/components/sections/FAQ";
import StylistsChoice from "@/components/sections/StylistsChoice";
import CallToAction from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Stats />
      <StylistsChoice />
      <ServiceHighlight />
      <GalleryPreview />
      <InstagramFeed />
      <Team />
      <GoogleReviews />
      <FAQ />
      <CallToAction />
    </div>
  );
}
