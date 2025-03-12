/**
 * 네이버 검색광고 API 서비스
 * 설명:

이 파일은 네이버 검색광고 API와 통신하기 위한 모든 함수들을 포함합니다.
환경 변수에서 인증 정보를 가져와 API 요청 헤더를 생성합니다.
검색 데이터, 트렌드 데이터, 관련 키워드, CTR 데이터 등을 가져오는 함수들을 제공합니다.
네이버 API는 일부 기능을 직접 제공하지 않을 수 있으므로, 모의 데이터 생성 함수도 포함합니다.
API 응답 데이터를 프론트엔드에서 사용하기 좋은 형식으로 가공하는 처리 함수들이 있습니다.

 * 이 모듈은 네이버 검색광고 API와 통신하는 함수들을 제공합니다.
 * API 요청 헤더 생성 및 다양한 엔드포인트 호출 기능을 포함합니다.
 */
import { Signature } from './signature-helper';

// 기본 API 구성 - 환경 변수에서 가져옵니다
const BASE_URL = 'https://api.searchad.naver.com';
const API_KEY = process.env.NAVER_API_KEY;
const SECRET_KEY = process.env.NAVER_SECRET_KEY;
const CUSTOMER_ID = process.env.NAVER_CUSTOMER_ID;

/**
 * API 요청에 필요한 인증 헤더를 생성합니다
 * 
 * @param method - HTTP 메서드 (GET, POST 등)
 * @param uri - API 요청 경로 (/keywordstool 등)
 * @returns - API 요청에 필요한 헤더 객체
 */
export function getHeader(method: string, uri: string) {
  // 현재 시간을 밀리초 단위로 얻어 문자열로 변환
  const timestamp = String(Math.round(Date.now()));
  
  // 서명 생성
  const signature = Signature.generate(timestamp, method, uri, SECRET_KEY as string);
  
  // 네이버 API에서 요구하는 형식의 헤더 반환
  return {
    'Content-Type': 'application/json; charset=UTF-8', // JSON 형식 데이터를 사용함을 명시
    'X-Timestamp': timestamp, // 요청 시간
    'X-API-KEY': API_KEY, // API 키
    'X-Customer': CUSTOMER_ID, // 고객 ID
    'X-Signature': signature // 생성된 서명
  };
}

/**
 * 검색어에 대한 기본 정보와 통계를 가져옵니다
 * 
 * @param query - 검색어
 * @returns - 검색어에 대한 월간 검색량, 경쟁률 등의 정보
 */
export async function getSearchData(query: string) {
  // keywordstool 엔드포인트를 사용 - 키워드 관련 정보 제공
  const uri = '/keywordstool';
  const method = 'GET';
  
  // showDetail=1 옵션을 사용하여 상세 정보 요청
  const url = `${BASE_URL}${uri}?hintKeywords=${encodeURIComponent(query)}&showDetail=1`;
  
  // fetch API를 사용하여 GET 요청 수행
  const response = await fetch(url, {
    method,
    headers: getHeader(method, uri)
  });
  
  // 오류 확인
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  // JSON 응답 반환
  return response.json();
}

/**
 * 검색어의 시간에 따른 트렌드 데이터를 가져옵니다
 * 
 * @param query - 검색어
 * @param timeFrame - 시간 단위 (daily, weekly, monthly)
 * @param dateFrom - 시작 날짜 (YYYY-MM-DD)
 * @param dateTo - 종료 날짜 (YYYY-MM-DD)
 * @returns - 지정된 기간 동안의 검색 트렌드 데이터
 */
export async function getSearchTrends(query: string, timeFrame: string, dateFrom: string, dateTo: string) {
  // 네이버 API는 직접적인 트렌드 데이터를 제공하지 않으므로
  // keywordstool의 데이터를 가져와 가공합니다
  const uri = '/keywordstool';
  const method = 'GET';
  const url = `${BASE_URL}${uri}?hintKeywords=${encodeURIComponent(query)}&showDetail=1`;
  
  const response = await fetch(url, {
    method,
    headers: getHeader(method, uri)
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  // 데이터 가공 함수를 통해 트렌드 형식으로 변환
  const data = await response.json();
  return processSearchTrends(data, timeFrame, dateFrom, dateTo);
}

/**
 * API에서 가져온 데이터를 트렌드 형식으로 가공합니다
 * 
 * @param data - API에서 받아온 원본 데이터
 * @param timeFrame - 시간 단위 (daily, weekly, monthly)
 * @param dateFrom - 시작 날짜
 * @param dateTo - 종료 날짜
 * @returns - 일별/주별/월별 검색량 데이터
 */
function processSearchTrends(data: any, timeFrame: string, dateFrom: string, dateTo: string) {
  // 주의: 네이버 API는 실제로 트렌드 데이터를 제공하지 않으므로,
  // 현재는 모의 데이터를 생성하는 함수입니다.
  // 실제 API가 이런 데이터를 제공한다면 그에 맞게 수정해야 합니다.
  
  // 데이터 형식은 프론트엔드 컴포넌트와 호환되도록 유지
  return {
    daily: generateMockTrendData('daily', dateFrom, dateTo),
    weekly: generateMockTrendData('weekly', dateFrom, dateTo),
    monthly: generateMockTrendData('monthly', dateFrom, dateTo)
  };
}

/**
 * 모의 트렌드 데이터를 생성합니다 (실제 API가 없는 경우 사용)
 * 
 * @param period - 기간 타입 (daily, weekly, monthly)
 * @param dateFrom - 시작 날짜
 * @param dateTo - 종료 날짜
 * @returns - 모의 트렌드 데이터 배열
 */
function generateMockTrendData(period: string, dateFrom: string, dateTo: string) {
  const result = [];
  const startDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const endDate = dateTo ? new Date(dateTo) : new Date();
  
  const current = new Date(startDate);
  const baseVolume = 10000;
  
  while (current <= endDate) {
    // 날짜에 따른 랜덤한 검색량 생성
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 ~ 1.3
    const searches = Math.round(baseVolume * randomFactor);
    
    result.push({
      date: current.toISOString().split('T')[0], // YYYY-MM-DD 형식
      searches: searches
    });
    
    // 기간 타입에 따라 날짜 증가
    if (period === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (period === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }
  
  return result;
}

/**
 * 검색어와 관련된 키워드 목록을 가져옵니다
 * 
 * @param query - 검색어
 * @returns - 관련 키워드 목록
 */
export async function getRelatedKeywords(query: string) {
  const uri = '/keywordstool';
  const method = 'GET';
  const url = `${BASE_URL}${uri}?hintKeywords=${encodeURIComponent(query)}&showDetail=1`;
  
  const response = await fetch(url, {
    method,
    headers: getHeader(method, uri)
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  const data = await response.json();
  return processRelatedKeywords(data, query);
}

/**
 * API 응답에서 관련 키워드 데이터를 추출하고 가공합니다
 * 
 * @param data - API 응답 데이터
 * @param currentQuery - 현재 검색어
 * @returns - 관련 키워드 배열
 */
function processRelatedKeywords(data: any, currentQuery: string) {
  // 주의: 이 함수는 네이버 API의 실제 응답 구조에 맞게 수정해야 합니다
  // keywordstool 엔드포인트가 반환하는 데이터 형식을 확인해야 합니다
  
  // 예시 처리 로직:
  if (data && data.keywordList && Array.isArray(data.keywordList)) {
    return data.keywordList.slice(1).map((item: any) => {
      return {
        keyword: item.relKeyword || `${currentQuery} 관련`,
        monthlySearches: item.monthlyPcQcCnt || Math.floor(Math.random() * 10000) + 1000,
        productsFound: Math.floor(Math.random() * 200) + 10,
        category: Math.random() > 0.5 ? "전자제품" : "다른 카테고리"
      };
    });
  }
  
  // 데이터가 없으면 빈 배열 반환
  return [];
}

/**
 * 검색어에 대한 클릭률(CTR) 데이터를 가져옵니다
 * 
 * @param query - 검색어
 * @returns - 기기별, 성별, 연령대별, 요일별 CTR 데이터
 */
export async function getCtrData(query: string) {
  // 주의: 네이버 API는 이러한 CTR 데이터를 직접 제공하지 않을 수 있습니다
  // 이 함수는 현재 모의 데이터를 반환합니다
  
  // 실제 API가 이런 데이터를 제공한다면 해당 엔드포인트를 호출하고
  // 응답을 가공하는 코드로 대체해야 합니다
  
  return {
    byDevice: [
      { device: "Mobile", ctr: 5.2 },
      { device: "Desktop", ctr: 3.8 }
    ],
    byGender: [
      { gender: "Female", ctr: 4.7, value: 55 },
      { gender: "Male", ctr: 3.9, value: 45 }
    ],
    byAge: [
      { age: "10s", ctr: 3.2 },
      { age: "20s", ctr: 5.8 },
      { age: "30s", ctr: 4.9 },
      { age: "40s", ctr: 3.5 },
      { age: "50s", ctr: 2.8 },
      { age: "60s+", ctr: 2.1 }
    ],
    byWeekday: [
      { day: "Mon", ctr: 4.2 },
      { day: "Tue", ctr: 4.5 },
      { day: "Wed", ctr: 4.8 },
      { day: "Thu", ctr: 4.6 },
      { day: "Fri", ctr: 4.3 },
      { day: "Sat", ctr: 3.2 },
      { day: "Sun", ctr: 3.0 }
    ]
  };
}