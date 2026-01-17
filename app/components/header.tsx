"use client"

import { Ship, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className=" bg-[#0D253F] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div style={{
              backgroundImage: 'url("/image.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }} className="h-12 w-12 rounded-full" />
            <span className="text-xl font-bold">Guardería La Chueca</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="font-semibold hover:opacity-80 transition-opacity">
              Inicio
            </a>
            <a href="/#nosotros" className="font-semibold hover:opacity-80 transition-opacity">
              Nosotros
            </a>
            <a href="#contacto" className="font-semibold hover:opacity-80 transition-opacity">
              Contacto
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground hover:bg-primary-foreground/10 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-primary-foreground/20 pt-4">
            <a
              href="#inicio"
              className="font-semibold hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>
            <a
              href="#nosotros"
              className="font-semibold hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="font-semibold hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
