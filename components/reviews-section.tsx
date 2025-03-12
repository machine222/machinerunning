"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Review {
  id: number
  name: string
  title: string
  content: string
  rating: number
  image: string
}

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const reviews: Review[] = [
    {
      id: 1,
      name: "Kim Min-ji",
      title: "Game-changing for my business",
      content:
        "The keyword research tool helped me find profitable niches I never would have discovered on my own. My sales have increased by 40% in just two months!",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Park Ji-hoon",
      title: "Worth every penny",
      content:
        "After taking the free lecture, I immediately signed up for the paid course. The strategies I learned helped me achieve my monthly sales target within just two weeks.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Lee Soo-jin",
      title: "Excellent support and resources",
      content:
        "The team behind Machine Learning is incredibly supportive. Whenever I had questions, they responded quickly and provided detailed guidance. The tools are intuitive and powerful.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Choi Jae-woo",
      title: "Transformed my approach",
      content:
        "The margin calculator alone saved me from making several bad investment decisions. The course content is practical and immediately applicable.",
      rating: 4,
      image: "/placeholder.svg?height=100&width=100",
    },
    // Duplicate reviews to create continuous scrolling effect
    {
      id: 5,
      name: "Kim Min-ji",
      title: "Game-changing for my business",
      content:
        "The keyword research tool helped me find profitable niches I never would have discovered on my own. My sales have increased by 40% in just two months!",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Park Ji-hoon",
      title: "Worth every penny",
      content:
        "After taking the free lecture, I immediately signed up for the paid course. The strategies I learned helped me achieve my monthly sales target within just two weeks.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      name: "Lee Soo-jin",
      title: "Excellent support and resources",
      content:
        "The team behind Machine Learning is incredibly supportive. Whenever I had questions, they responded quickly and provided detailed guidance. The tools are intuitive and powerful.",
      rating: 5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      name: "Choi Jae-woo",
      title: "Transformed my approach",
      content:
        "The margin calculator alone saved me from making several bad investment decisions. The course content is practical and immediately applicable.",
      rating: 4,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // Reset scroll position when it reaches the end
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollLeft = 0
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll)

    // Auto-scroll animation
    const autoScroll = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += 1
        }
      }
    }

    const interval = setInterval(autoScroll, 30)

    return () => {
      clearInterval(interval)
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="w-full py-12 md:py-24 bg-white overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Don&apos;t just take our word for it. See what our users have achieved.
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 -mx-4 px-4 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="flex-shrink-0 w-[350px] md:w-[400px] snap-center hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Image
                    src={review.image || "/placeholder.svg"}
                    alt={review.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{review.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"} fill-current`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-xl font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-500">{review.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  )
}

