/**
 * RelatedKeywords 컴포넌트
 *
 * 목적:
 * 현재 검색 쿼리와 관련된 키워드 목록을 표시합니다.
 * 이 컴포넌트는 사용자가 추가적인 관련 검색어를 발견하는 데 도움을 주도록 설계되었습니다.
 *
 * 데이터 소스:
 * 현재는 데모 목적으로 모의 데이터를 사용합니다.
 * 실제 환경에서는 현재 검색 쿼리를 기반으로 의미적으로 또는 범주적으로
 * 관련된 키워드를 반환하는 API에서 데이터를 가져올 것입니다.
 *
 * 상호작용:
 * 각 키워드는 클릭 가능하며 해당 키워드에 대한 새 검색 결과 페이지로 이동합니다.
 *
 * @param {string} currentQuery - 관련 키워드를 찾기 위한 현재 검색 쿼리
 * @param {string} currentCategory - 현재 검색 쿼리의 카테고리(매칭용)
 */

"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RelatedKeyword {
  keyword: string
  monthlySearches: number
  productsFound: number
  category: string
}

interface RelatedKeywordsProps {
  currentQuery: string
  currentCategory: string
}

export default function RelatedKeywords({ currentQuery, currentCategory }: RelatedKeywordsProps) {
  const router = useRouter()

  /**
   * 관련 키워드에 대한 모의 데이터
   * 실제 환경에서는 currentQuery 매개변수를 기반으로
   * API에서 가져올 것입니다
   */
  const relatedKeywords: RelatedKeyword[] = [
    {
      keyword: `${currentQuery} 온라인`,
      monthlySearches: 8500,
      productsFound: 120,
      category: currentCategory,
    },
    {
      keyword: `최고의 ${currentQuery}`,
      monthlySearches: 12000,
      productsFound: 85,
      category: currentCategory,
    },
    {
      keyword: `${currentQuery} 리뷰`,
      monthlySearches: 6300,
      productsFound: 42,
      category: currentCategory,
    },
    {
      keyword: `저렴한 ${currentQuery}`,
      monthlySearches: 9200,
      productsFound: 156,
      category: "저가 제품", // 데모를 위한 다른 카테고리
    },
    {
      keyword: `${currentQuery} 대안`,
      monthlySearches: 4100,
      productsFound: 67,
      category: "대안", // 데모를 위한 다른 카테고리
    },
    {
      keyword: `프리미엄 ${currentQuery}`,
      monthlySearches: 3800,
      productsFound: 29,
      category: "프리미엄 제품", // 데모를 위한 다른 카테고리
    },
    {
      keyword: `초보자를 위한 ${currentQuery}`,
      monthlySearches: 7500,
      productsFound: 93,
      category: currentCategory,
    },
  ]

  /**
   * 관련 키워드가 클릭되었을 때 탐색을 처리합니다
   * 선택한 키워드에 대한 검색 결과 페이지로 사용자를 리디렉션합니다
   *
   * @param {string} keyword - 검색할 키워드
   */
  const handleKeywordClick = (keyword: string) => {
    router.push(`/search-results?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">관련 키워드</CardTitle>
        <CardDescription>"{currentQuery}"와(과) 관련된 다른 검색어 찾기</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 
          관련 키워드를 위한 스크롤 가능한 컨테이너
          관련 키워드 수에 관계없이 일관된 카드 크기를 유지하기 위한
          오버플로우가 있는 고정 높이
        */}
        <div className="max-h-[240px] overflow-y-auto pr-2 -mr-2">
          <div className="space-y-3">
            {relatedKeywords.map((item, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleKeywordClick(item.keyword)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-blue-600 hover:underline flex items-center">
                    {item.keyword}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>

                  {/* 
                    카테고리 일치 표시기
                    이 키워드가 현재 검색과 동일한 카테고리에 속하는지 여부를 표시합니다
                  */}
                  {item.category === currentCategory ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      카테고리 일치
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                      다른 카테고리
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>월 {item.monthlySearches.toLocaleString()}회 검색</span>
                  <span>{item.productsFound}개 상품</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

