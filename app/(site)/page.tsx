import Navbar        from "@/components/sections/navbar";
import Hero          from "@/components/sections/hero";
import Services      from "@/components/sections/services";
import Process       from "@/components/sections/process";
import Plans         from "@/components/sections/plans";
import Testimonials  from "@/components/sections/testimonials";
import FAQ           from "@/components/sections/faq";
import SupportForm   from "@/components/sections/support-form";
import Contact       from "@/components/sections/contact";
import Footer        from "@/components/sections/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import BackToTop from "@/components/back-to-top";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Plans />
      <Testimonials />
      <FAQ />
      <SupportForm />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </main>
  );
}