import type React from "react"
import Footer from "@/components/footer"

export default function ItemSourcingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <Footer />
    </div>
  )
}

