import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function PaidCourseBanner() {
  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Ready to take your business to the next level?
            </h2>
            <p className="max-w-[600px] text-blue-100">
              Explore our Monthly 3000 Achievement Project and choose a plan that fits your needs.
            </p>
          </div>
          <Link href="/purchase">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

