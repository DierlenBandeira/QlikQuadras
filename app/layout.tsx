import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { inter, sora } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Clik Quadras - Reserve sua quadra com um clique",
  description:
    "Plataforma para reserva de quadras esportivas. Encontre e reserve quadras de futebol, vôlei, basquete, tênis e beach tennis de forma rápida e fácil.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
