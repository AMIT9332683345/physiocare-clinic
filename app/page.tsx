import About from "@/components/About";
import Blog from "@/components/Blog";
import BookingForm from "@/components/BookingForm";
import Faqs from "@/components/Faqs";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import { loadContent } from "@/lib/content";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export const revalidate = 300;

export default async function Home() {
  const content = await loadContent();

  return (
    <>
      <Hero />
      <Process steps={content.process} />
      <Services services={content.services} />
      <About team={content.team} />
      <Pricing packages={content.packages} />
      <Testimonials items={content.testimonials} />
      <Faqs faqs={content.faqs} />
      <Blog articles={content.articles} />
      <BookingForm services={content.services.map((s) => s.title)} times={TIME_SLOTS} />
    </>
  );
}
