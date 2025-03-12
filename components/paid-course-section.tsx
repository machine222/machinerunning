import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PaidCourseSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-2">
            Monthly 3000 Achievement Project
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Path to Success</h2>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Upgrade after taking the free lecture and accelerate your success with our premium courses
          </p>
        </div>

        {/* Pricing toggle - could be implemented with state */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <span className="text-sm font-medium text-gray-500">Monthly</span>
          <div className="w-12 h-6 bg-blue-200 rounded-full p-1 cursor-pointer">
            <div className="bg-blue-600 w-4 h-4 rounded-full transform translate-x-6"></div>
          </div>
          <span className="text-sm font-medium text-blue-600">
            Annual <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">Save 20%</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="p-6 pt-8 text-center">
              <h3 className="text-xl font-bold">Basic</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold">₩79,000</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-4 text-gray-500">Perfect for beginners looking to start their e-commerce journey</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Basic keyword research tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Standard profit calculator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Weekly market reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Email support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Access to community forum</span>
                </li>
              </ul>
              <Button className="mt-8 w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50">
                Get Started
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-blue-600 bg-white shadow-lg transform md:-translate-y-4 z-10">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            </div>
            <div className="p-6 pt-8 text-center">
              <h3 className="text-xl font-bold">Premium</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold">₩120,000</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-4 text-gray-500">For serious sellers looking to scale their business</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Advanced keyword research tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Advanced profit optimization</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Daily market reports & analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Priority email & chat support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Monthly group coaching calls</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Competitor analysis tools</span>
                </li>
              </ul>
              <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </div>
          </div>

          {/* Master Class Plan */}
          <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-blue-50 shadow-sm transition-all hover:shadow-md">
            <div className="p-6 pt-8 text-center">
              <h3 className="text-xl font-bold">Master Class</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold">₩199,000</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-4 text-gray-500">The ultimate package for professional e-commerce entrepreneurs</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>All Premium features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>1-on-1 weekly coaching calls</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Custom business strategy plan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Advanced AI market predictions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>VIP access to exclusive events</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                  <span>Direct access to our expert team</span>
                </li>
              </ul>
              <Button className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-3xl mx-auto bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Student Portrait"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-700 italic mb-4">
                "After taking the free lecture, I upgraded to the Premium plan. Within just 3 months, I was able to
                increase my monthly revenue by over ₩3,000,000. The strategies and tools provided are invaluable."
              </p>
              <div className="font-medium">Park Ji-hoon</div>
              <div className="text-sm text-gray-500">E-commerce Store Owner</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium">Can I switch between plans?</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing
                cycle.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium">Is there a money-back guarantee?</h4>
              <p className="mt-2 text-gray-600 text-sm">
                We offer a 14-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

