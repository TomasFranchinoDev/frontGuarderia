import { Facebook, Instagram, Map, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#0D253F] text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <span className="font-semibold">Contacto: Guardería La Chueca</span>
            <span className="hidden md:inline">|</span>
            <a href="tel:+543493417508" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-4 w-4" />
              (3493) 417508
            </a>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/cabanas.saladero"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.google.com/maps/place/Caba%C3%B1as+del+Saladero/@-30.8806438,-60.0359611,17z/data=!3m1!4b1!4m6!3m5!1s0x95b4b19d546246ed:0x2e09f26a30fba8e5!8m2!3d-30.8806438!4d-60.0359611!16s%2Fg%2F11sg7w6nxg?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Google"
            >
              <Map className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/pescasaladero"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-sm text-white/70">
          © {new Date().getFullYear()} Guardería La Chueca. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
