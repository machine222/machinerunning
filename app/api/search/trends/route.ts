/**
 * 검색 트렌드 API 라우트
 * 설명:

이 파일은 /api/search/trends 경로의 GET 요청을 처리하는 API 라우트입니다.
URL 파라미터에서 검색어, 시간 단위, 날짜 범위를 추출합니다.
네이버 API를 호출하여 트렌드 데이터를 가져오고, JSON 응답으로 반환합니다.
현재는 실제 네이버 API가 이러한 트렌드 데이터를 직접 제공하지 않을 수 있으므로, getSearchTrends 함수에서 모의 데이터를 생성할 수 있습니다.
 * 이 파일은 /api/search/trends 경로로 들어오는 요청을 처리합니다.
 * 검색어에 대한 시간별 트렌드 데이터(일별/주별/월별)를 반환합니다.
 * 
 * 요청 파라미터:
 * - q: 검색어
 * - timeFrame: 시간 단위 (daily, weekly, monthly)
 * - dateFrom: 시작 날짜 (YYYY-MM-DD)
 * - dateTo: 종료 날짜 (YYYY-MM-DD)
 */
import { NextResponse } from 'next/server';
import { getSearchTrends } from '@/lib/naver-api';

/**
 * GET 요청 핸들러
 * 
 * @param request - HTTP 요청 객체
 * @returns - 검색 트렌드 데이터가 포함된 JSON 응답
 */
export async function GET(request: Request) {
  // URL에서 필요한 파라미터 추출
  const { searchParams } = new URL(request.url);
  
  // 검색어 - 필수 파라미터, 없으면 빈 문자열 사용
  const query = searchParams.get('q') || '';
  
  // 시간 단위 - 기본값 'weekly'
  const timeFrame = searchParams.get('timeFrame') || 'weekly';
  
  // 시작 날짜와 종료 날짜 - 없으면 빈 문자열 사용
  // (getSearchTrends 함수에서 기본값 처리)
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  
  try {
    // 네이버 API를 통해 트렌드 데이터 가져오기
    const data = await getSearchTrends(query, timeFrame, dateFrom, dateTo);
    
    // 데이터를 JSON 응답으로 반환
    return NextResponse.json(data);
  } catch (error) {
    // 오류 처리 및 로깅
    console.error('API Error:', error);
    
    // 클라이언트에 오류 응답 반환
    return NextResponse.json(
      { error: 'Failed to fetch trend data' }, 
      { status: 500 }
    );
  }
}