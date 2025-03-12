// Update the button text and add comprehensive comments to the Hero component

/**
 * Hero Component
 *
 * Purpose:
 * Main landing section that captures user attention and provides primary search functionality.
 *
 * Features:
 * - Search bar for keyword research
 * - Call-to-action buttons for primary user journeys
 * - Visual elements to enhance user engagement
 *
 * @component
 */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Hero() {
  // State to track the current search query input
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  /**
   * Handles the search form submission
   * Navigates to search results page with the current query
   *
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-white to-gray-50">
      {/* 
        SECTION 1: DECORATIVE ELEMENTS
        Abstract shapes and patterns to create visual interest
      */}
      {/* 1.1: Top-right decorative blob */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* 1.2: Bottom-left decorative blob */}
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* 1.3: Grid pattern overlay for tech aesthetic */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-[length:50px_50px] opacity-[0.015]"></div>

      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* 
              SECTION 2: HEADER ELEMENTS
              Main title, subtitle, and feature badge
            */}
            {/* 2.1: Feature badge */}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-blue-600" />
              <span>Powered by Machine Learning</span>
            </div>

            {/* 2.2: Main heading with gradient text highlight */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Search for keywords. <br className="hidden sm:inline" />
              We'll show you if they're{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                profitable
              </span>
              .
            </h1>

            {/* 2.3: Subheading with value proposition */}
            <p className="max-w-2xl text-lg md:text-xl text-gray-600">
              Essential tools and courses for sellers to maximize their online store potential
            </p>

            {/* 
              SECTION 3: SEARCH FUNCTIONALITY
              Search bar with example queries
            */}
            {/* 3.1: Search form with floating design */}
            <div className="w-full max-w-2xl mt-4">
              <form onSubmit={handleSearch} className="relative group">
                <Input
                  type="text"
                  placeholder="Enter a keyword..."
                  className="w-full h-14 pl-5 pr-14 rounded-xl border-gray-200 bg-white shadow-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-2 h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Search className="h-5 w-5 text-white" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>

              {/* 3.2: Example search queries */}
              <div className="flex flex-wrap justify-center gap-2 mt-3 text-sm text-gray-500">
                <span>Try:</span>
                <button
                  onClick={() => setSearchQuery("smartphone accessories")}
                  className="text-blue-600 hover:underline"
                >
                  smartphone accessories
                </button>
                <button onClick={() => setSearchQuery("home office")} className="text-blue-600 hover:underline">
                  home office
                </button>
                <button onClick={() => setSearchQuery("fitness equipment")} className="text-blue-600 hover:underline">
                  fitness equipment
                </button>
              </div>
            </div>

            {/* 
              SECTION 4: CALL-TO-ACTION BUTTONS
              Primary and secondary action buttons
            */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {/* 4.1: Primary CTA - Item Sourcing Button */}
              <Link href="/item-sourcing">
                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                  아이템 소싱하기
                </Button>
              </Link>

              {/* 4.2: Secondary CTA - Explore Tools Button */}
              <Button variant="outline" className="h-12 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                Explore Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* 
              SECTION 5: SOCIAL PROOF STATISTICS
              Key metrics to build credibility
            */}
            <div className="grid grid-cols-3 gap-8 pt-8 mt-8 border-t border-gray-100 text-center">
              {/* 5.1: Active Users Stat */}
              <div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>

              {/* 5.2: Success Rate Stat */}
              <div>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>

              {/* 5.3: Support Availability Stat */}
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        SECTION 6: DECORATIVE ILLUSTRATION
        Tech-themed background illustration
      */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-5xl opacity-10 pointer-events-none">
        <svg viewBox="0 0 1208 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.45">
            <path
              d="M1204.7 1024H3.3C1.5 1024 0 1022.5 0 1020.7V3.3C0 1.5 1.5 0 3.3 0H1204.7C1206.5 0 1208 1.5 1208 3.3V1020.7C1208 1022.5 1206.5 1024 1204.7 1024Z"
              fill="#2563EB"
            />
            <path
              d="M1132.5 933.2H75.5C73.7 933.2 72.2 931.7 72.2 929.9V94.1C72.2 92.3 73.7 90.8 75.5 90.8H1132.5C1134.3 90.8 1135.8 92.3 1135.8 94.1V929.9C1135.8 931.7 1134.3 933.2 1132.5 933.2Z"
              fill="#2563EB"
            />
            <path d="M604 301.6C604 301.6 604 301.6 604 301.6C604 301.6 604 301.6 604 301.6Z" fill="#2563EB" />
            <path d="M604 722.4C604 722.4 604 722.4 604 722.4C604 722.4 604 722.4 604 722.4Z" fill="#2563EB" />
            <path d="M604 512C604 512 604 512 604 512C604 512 604 512 604 512Z" fill="#2563EB" />
            <path d="M813.4 512C813.4 512 813.4 512 813.4 512C813.4 512 813.4 512 813.4 512Z" fill="#2563EB" />
            <path d="M394.6 512C394.6 512 394.6 512 394.6 512C394.6 512 394.6 512 394.6 512Z" fill="#2563EB" />
          </g>
        </svg>
      </div>
    </section>
  )
}

