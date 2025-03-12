/**
 * 관련 키워드 API 라우트
 * 설명:

 * 이 파일은 /api/search/related?q={query} 경로의 GET 요청을 처리하는 API 라우트입니다.
 * URL 파라미터에서 검색어를 추출하고, 네이버 API를 호출하여 관련 키워드 데이터를 가져옵니다.
 * 네이버의 keywordstool API는 관련 키워드 정보를 제공하므로, 이 데이터를 추출하고 가공하여 반환합니다.
 * 오류가 발생하면 적절한 오류 메시지와 HTTP 상태 코드(500)를 반환합니다.
 * 이 파일은 /api/search/related?q={query} 경로로 들어오는 요청을 처리합니다.
 * 검색어와 관련된 키워드 목록을 반환합니다.
 */
import { NextResponse } from 'next/server';
import { getRelatedKeywords } from '@/lib/naver-api';

/**
 * GET 요청 핸들러
 * 
 * @param request - HTTP 요청 객체
 * @returns - 관련 키워드 목록이 포함된 JSON 응답
 */
export async function GET(request: Request) {
  // URL에서 검색어(q) 파라미터 추출
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  try {
    // 네이버 API를 통해 관련 키워드 데이터 가져오기
    const data = await getRelatedKeywords(query);
    
    // 데이터를 JSON 응답으로 반환
    return NextResponse.json(data);
  } catch (error) {
    // 오류 처리 및 로깅
    console.error('API Error:', error);
    
    // 클라이언트에 오류 응답 반환
    return NextResponse.json(
      { error: 'Failed to fetch related keywords' }, 
      { status: 500 }
    );
  }
}