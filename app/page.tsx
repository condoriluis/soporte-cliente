import Navbar      from "@/components/sections/navbar";
import Hero        from "@/components/sections/hero";
import Services    from "@/components/sections/services";
import Process     from "@/components/sections/process";
import SupportForm from "@/components/sections/support-form";
import Footer      from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <SupportForm />
      <Footer />
    </main>
  );
}
