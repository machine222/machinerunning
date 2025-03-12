/**
 * app/api/search/ctr/route.ts
 * 이 파일은 검색어의 인구통계학적 CTR(클릭률) 데이터를 제공하는 API 엔드포인트입니다.
 * 네이버 API에 직접적인 CTR 데이터 API가 없는 경우, 모의 데이터를 반환할 수 있습니다.
 * 반환되는 데이터는 기기별, 성별, 연령대별, 요일별 CTR 정보를 포함합니다.
 * 이 데이터는 프론트엔드의 CTR 분석 섹션에서 차트와 통계로 표시됩니다.
 * 이 파일은 CTR(클릭률) 데이터를 제공하는 API 엔드포인트를 정의합니다.
 * 클라이언트에서 '/api/search/ctr?q=키워드'와 같은 형식으로 요청합니다.
 */

import { NextResponse } from 'next/server';
import { getCtrData } from '@/lib/naver-api';

/**
 * GET 핸들러 함수
 * 클라이언트의 GET 요청을 처리합니다
 * 
 * @param request - API 요청 객체
 * @returns JSON 형식의 응답
 * 
 * 이 함수는 다음과 같은 역할을 합니다:
 * 1. URL에서 'q' 쿼리 파라미터를 추출합니다 (검색 키워드)
 * 2. naver-api.ts의 getCtrData 함수를 호출하여 CTR 데이터를 가져옵니다
 * 3. 가져온 데이터를 클라이언트에게 JSON 형식으로 반환합니다
 * 
 * 참고: 네이버 API에 직접적인 CTR 데이터 API가 없는 경우,
 * getCtrData 함수는 모의 데이터를 반환할 수 있습니다.
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  try {
    // 네이버 API(또는 모의 데이터)에서 CTR 데이터 가져오기
    const data = await getCtrData(query);
    
    // 가져온 데이터를 JSON 형식으로 반환
    return NextResponse.json(data);
  } catch (error) {
    // 오류 로깅 및 오류 응답 반환
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CTR data' }, 
      { status: 500 }
    );
  }
}