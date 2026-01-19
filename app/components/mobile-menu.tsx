"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"

type NavLink = {
    href: string
    label: string
}

type Props = {
    links: NavLink[]
}

export function MobileMenu({ links }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className="md:hidden">
            <button
                className="text-primary-foreground hover:bg-primary-foreground/10 p-2"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-label="Toggle navigation"
            >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {open && (
                <nav className="mt-4 pb-4 flex flex-col gap-4 border-t border-primary-foreground/20 pt-4">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="font-semibold hover:opacity-80 transition-opacity"
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            )}
        </div>
    )
}