import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { TokenRefreshHandler } from "@/components/token-refresh-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MarkazGN - Tableau de bord administratif",
  description: "Plateforme de gestion pour MarkazGN",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <TokenRefreshHandler />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
