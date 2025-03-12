/**
 * 검색 기본 정보 API 라우트
 * 설명:

이 파일은 /api/search?q={query} 경로의 GET 요청을 처리하는 API 라우트입니다.
URL 파라미터에서 검색어를 추출하고, 네이버 API를 호출하여 데이터를 가져옵니다.
가져온a 데이터를 프론트엔드에서 필요로 하는 형식으로 가공하여 JSON 응답으로 반환합니다.
오류가 발생하면 적절한 오류 메시지와 HTTP 상태 코드(500)를 반환합니다.
 * 이 파일은 /api/search?q={query} 경로로 들어오는 요청을 처리합니다.
 * 검색어에 대한 기본 정보(월간 검색량, 상품 수, 카테고리 정보)를 반환합니다.
 */
import { NextResponse } from 'next/server';
import { getSearchData } from '@/lib/naver-api';

/**
 * GET 요청 핸들러
 * 
 * @param request - HTTP 요청 객체
 * @returns - 검색 결과 데이터가 포함된 JSON 응답
 */
export async function GET(request: Request) {
  // URL에서 검색어(q) 파라미터 추출
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  try {
    // 네이버 API를 통해 검색 데이터 가져오기
    const data = await getSearchData(query);
    
    // 응답 데이터 구성
    // 실제 API 응답 구조에 맞게 수정 필요
    return NextResponse.json({
      // 월간 검색량 - 첫 번째 키워드의 PC 검색량 사용
      // 데이터가 없으면 기본값 0 사용
      monthlySearches: data.keywordList?.[0]?.monthlyPcQcCnt || 0,
      
      // 상품 수 - 현재는 모의 데이터 생성
      // 실제로는 다른 API 또는 데이터 소스에서 가져와야 함
      productsFound: Math.floor(Math.random() * 500) + 50,
      
      // 카테고리 정보 - 현재는 하드코딩된 데이터
      // 실제로는 API에서 제공하는 카테고리 정보 사용 필요
      categories: {
        mainCategory: "전자제품",
        categoryPath: [
          { id: "1", name: "전자제품", level: 1 },
          { id: "14", name: "액세서리", level: 2 },
          { id: "143", name: "스마트폰 액세서리", level: 3 }
        ],
        relatedCategories: [
          { id: "144", name: "노트북 액세서리" },
          { id: "145", name: "태블릿 액세서리" },
          { id: "146", name: "오디오 액세서리" }
        ]
      }
    });
  } catch (error) {
    // 오류 처리 및 로깅
    console.error('API Error:', error);
    
    // 클라이언트에 오류 응답 반환
    return NextResponse.json(
      { error: 'Failed to fetch search data' }, 
      { status: 500 }
    );
  }
}