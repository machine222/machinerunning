/**
 * SearchBar 컴포넌트
 *
 * 목적:
 * 사용자가 검색 쿼리를 수정할 수 있는 검색 입력 필드를 제공합니다.
 * 쉽게 접근할 수 있도록 검색 결과 페이지 상단에 위치합니다.
 *
 * 기능:
 * - 현재 검색 쿼리로 미리 채워짐
 * - 새 쿼리를 제출하고 업데이트된 검색 결과로 이동
 * - 페이지 레이아웃과 더 잘 통합되도록 왼쪽 정렬
 *
 * 구현 참고사항:
 * 이 컴포넌트는 사용자가 검색 쿼리를 수정할 때
 * 새 검색 결과로의 클라이언트 측 탐색을 처리합니다.
 */

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchBarProps {
  initialQuery: string
}

export default function SearchBar({ initialQuery }: SearchBarProps) {
  // 현재 입력 값을 추적하는 상태
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  /**
   * handleSearch 함수
   *
   * 목적:
   * 검색 폼 제출을 처리하고 새 검색 결과로 이동합니다.
   *
   * 구현 참고사항:
   * 업데이트된 쿼리로 검색 결과 페이지로 이동하기 위해 Next.js 라우터를 사용합니다.
   * encodeURIComponent는 쿼리의 특수 문자가 올바르게 처리되도록 합니다.
   *
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
      {/* 
        제출 버튼이 있는 검색 입력 필드
        페이지 레이아웃과 더 잘 통합되도록 왼쪽 정렬
      */}
      <div className="relative">
        <Input
          type="text"
          placeholder="키워드 검색..."
          className="w-full h-12 pl-4 pr-12 rounded-lg border-gray-200 bg-white shadow-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="검색 입력"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
          aria-label="검색 제출"
        >
          <Search className="h-4 w-4 text-white" />
          <span className="sr-only">검색</span>
        </Button>
      </div>
    </form>
  )
}

