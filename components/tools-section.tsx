import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Calculator, BarChart, TrendingUp, ArrowRight, Zap } from "lucide-react"

export default function ToolsSection() {
  const tools = [
    {
      title: "Big Data Keyword Search",
      description: "Find profitable keywords for your products with our advanced search tool.",
      icon: <Search className="h-6 w-6 text-blue-600" />,
      link: "/tools/keyword-search",
      popular: true,
    },
    {
      title: "Margin Calculator",
      description: "Calculate your profit margins easily with our simple calculator.",
      icon: <Calculator className="h-6 w-6 text-blue-600" />,
      link: "/tools/margin-calculator",
    },
    {
      title: "Market Analysis",
      description: "Analyze market trends and make informed decisions for your business.",
      icon: <BarChart className="h-6 w-6 text-blue-600" />,
      link: "/tools/market-analysis",
    },
    {
      title: "Trend Tracker",
      description: "Stay ahead of the competition by tracking the latest trends in your niche.",
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      link: "/tools/trend-tracker",
    },
  ]

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Abstract decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-[length:50px_50px] opacity-[0.015]"></div>

      <div className="container relative px-4 md:px-6 z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-4">
            <Zap className="h-3.5 w-3.5 mr-2 text-blue-600" />
            <span>Powerful Tools</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Essential Tools for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Sellers</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Boost your online store with our powerful, data-driven tools
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-blue-100 ${
                tool.popular ? "ring-2 ring-blue-100 shadow-md" : ""
              }`}
            >
              {tool.popular && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    Popular
                  </div>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                >
                  Try Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            variant="outline"
            className="h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg group"
          >
            View More Programs
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Tech pattern decoration */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl opacity-5 pointer-events-none">
          <svg width="100%" height="40" viewBox="0 0 1000 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20H1000" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="8 8" />
            <path d="M0 30H1000" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="6 6" />
            <path d="M0 10H1000" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </section>
  )
}

