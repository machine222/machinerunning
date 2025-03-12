/**
 * 검색 결과 페이지
 *
 * 목적:
 * 사용자의 검색 쿼리에 대한 결과를 표시하는 페이지 컴포넌트입니다.
 * 이 페이지는 SearchResults 컴포넌트를 렌더링하여 검색 결과를 표시합니다.
 *
 * 구현 참고사항:
 * - 서버 컴포넌트로 구현되어 있어 클라이언트 상태를 관리하지 않습니다.
 * - 실제 검색 로직과 결과 표시는 SearchResults 컴포넌트에서 처리합니다.
 */
import SearchResults from "@/components/search-results/search-results"

export default function SearchResultsPage() {
  return <SearchResults />
}

