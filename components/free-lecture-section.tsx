import Image from "next/image"
import CountdownTimer from "./countdown-timer"

export default function FreeLectureSection() {
  // Set the target date to 7 days from now
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 7)

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-blue-100">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 transform origin-top-right"></div>

          <div className="relative p-6 md:p-10">
            {/* Header with badge */}
            <div className="flex flex-col items-center text-center mb-8 md:mb-12">
              <div className="inline-block rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white font-medium mb-4">
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center max-w-3xl">
                <span className="text-blue-600">0 Won</span> Special Lecture
              </h2>
              <p className="mt-4 text-gray-600 md:text-lg max-w-2xl text-center">
                Start your journey with our free comprehensive lecture. Learn the fundamentals of e-commerce and set
                yourself up for success.
              </p>
            </div>

            {/* Timer section */}
            <div className="bg-blue-50 rounded-xl p-6 mb-10 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">Offer ends in:</h3>
              <CountdownTimer targetDate={targetDate} />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Left content */}
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">What you'll learn:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">E-commerce fundamentals</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Keyword research techniques</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Basic profit calculation</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Market trend analysis</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                      Apply Now
                      <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Right content - Video preview */}
              <div className="lg:col-span-2">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    alt="Free Lecture Preview"
                    width={640}
                    height={360}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">Introduction to E-commerce</h3>
                      <p className="text-sm opacity-90 mt-1">Learn the basics and start your journey</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 backdrop-blur-sm p-4 cursor-pointer hover:bg-white/30 transition-colors">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm text-gray-600">
                      <span className="font-medium">Pro tip:</span> 98% of our free lecture students upgrade to the paid
                      course
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5,000+</div>
                <div className="text-sm text-gray-500 mt-1">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500 mt-1">Hours of Content</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="text-sm text-gray-500 mt-1">Student Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-500 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

