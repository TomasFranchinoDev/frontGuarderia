import Image from "next/image"
import { MobileMenu } from "./mobile-menu"

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
]

export function Header() {
  return (
    <header className="bg-[#0D253F] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/image.webp"
              alt="Guardería La Chueca"
              width={48}
              height={48}
              priority={false}
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold">Guardería La Chueca</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-semibold hover:opacity-80 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  )
}
