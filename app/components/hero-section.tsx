/*import { ConsultationCard } from "@/components/consultation-card"*/

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/parana-river-sunset-boats-brown-water-green-vegeta.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
     {/*<ConsultationCard /> */}
    </section>
  )
}
