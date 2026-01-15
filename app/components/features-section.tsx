import { Anchor, Shield, Fish, Mail } from "lucide-react"

const features = [
  {
    icon: Anchor,
    title: "Servicios",
    description: "Amarradero seguro para embarcaciones de todos los tamaños con acceso las 24 horas del día.",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Vigilancia continua y sistemas de monitoreo para proteger tu inversión.",
  },
  {
    icon: Fish,
    title: "Pesca Paraná",
    description: "Ubicación privilegiada en el Río Paraná, ideal para los amantes de la pesca deportiva.",
  },
  {
    icon: Mail,
    title: "Contacto",
    description: "Estamos disponibles para atender tus consultas y necesidades en todo momento.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-card py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
