/**
 * 검색 결과 페이지 레이아웃
 *
 * 목적:
 * 검색 결과 페이지의 전체 레이아웃을 정의합니다.
 * 네비게이션 바와 푸터를 포함하여 일관된 페이지 구조를 제공합니다.
 *
 * 구현 참고사항:
 * - 모든 검색 결과 페이지는 이 레이아웃 내에서 렌더링됩니다.
 * - flex-grow를 사용하여 메인 콘텐츠가 가능한 많은 공간을 차지하도록 합니다.
 */
import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SearchResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

