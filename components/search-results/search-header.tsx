/**
 * SearchHeader 컴포넌트
 *
 * 목적:
 * 검색 결과 페이지 상단에 표시되는 헤더 컴포넌트입니다.
 * 검색 쿼리, 카테고리 정보, 주요 지표(월간 검색량, 상품 수)를 표시합니다.
 *
 * 구현 참고사항:
 * - 계층적 카테고리 구조를 시각적으로 표현합니다
 * - 주요 검색 지표를 강조하여 표시합니다
 * - 실제 환경에서는 API에서 카테고리 데이터를 가져올 것입니다
 */
import { Badge } from "@/components/ui/badge"

interface SearchHeaderProps {
  query: string
  monthlySearches: number
  productsFound: number
}

export default function SearchHeader({ query, monthlySearches, productsFound }: SearchHeaderProps) {
  /**
   * 모의 카테고리 데이터
   * 데모 목적으로 사용되는 계층적 카테고리 구조입니다.
   * 실제 환경에서는 쿼리 매개변수를 기반으로 API에서 가져올 것입니다.
   *
   * 이 데이터 구조는 다음을 보여줍니다:
   * 1. 다중 레벨 카테고리 계층(최대 4단계 깊이)
   * 2. parentId 참조를 통한 부모-자식 관계
   * 3. 현실적인 카테고리 명명 규칙
   */
  const categoryData = {
    // 현재 검색의 주요 카테고리
    mainCategory: "전자제품",

    // 계층적 카테고리 경로
    categoryPath: [
      { id: "1", name: "전자제품", level: 1 },
      { id: "14", name: "액세서리", level: 2 },
      { id: "143", name: "스마트폰 액세서리", level: 3 },
    ],

    // 동일 레벨의 관련 카테고리
    relatedCategories: [
      { id: "144", name: "노트북 액세서리" },
      { id: "145", name: "태블릿 액세서리" },
      { id: "146", name: "오디오 액세서리" },
    ],
  }

  return (
    <div className="space-y-4 mb-8">
      {/* 
        검색 쿼리 표시
        시각적 강조와 함께 현재 검색어를 표시합니다
      */}
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        "<span className="text-blue-600">{query}</span>"에 대한 검색 결과
      </h1>

      {/* 
        카테고리 계층 표시
        현재 검색에 대한 카테고리의 계층적 경로를 표시합니다
        
        구현 참고사항:
        이 섹션은 카테고리 데이터를 가져오기 위한 향후 API 통합을 위해 설계되었습니다.
        현재 구현은 데모용 모의 데이터를 사용합니다.
      */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
        <span>카테고리:</span>
        {categoryData.categoryPath.map((category, index) => (
          <div key={category.id} className="flex items-center">
            {index > 0 && <span className="mx-1 text-gray-400">/</span>}
            <Badge
              variant="outline"
              className={`hover:bg-gray-100 cursor-pointer ${
                index === categoryData.categoryPath.length - 1 ? "bg-blue-50 text-blue-700 border-blue-200" : ""
              }`}
            >
              {category.name}
            </Badge>
          </div>
        ))}
      </div>

      {/* 
        주요 지표 표시
        검색 결과에 대한 중요한 통계를 표시합니다
      */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">월간 검색량</span>
          <span className="text-2xl font-bold">{monthlySearches.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">발견된 상품</span>
          <span className="text-2xl font-bold">{productsFound.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

