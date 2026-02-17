import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConnectionStatus from "@/components/connection-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Healyx - Healthcare Management System",
  description: "A comprehensive healthcare management system for providers",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ConnectionStatus />
      </body>
    </html>
  )
}

