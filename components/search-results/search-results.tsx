/**
 * SearchResults 컴포넌트
 *
 * 목적:
 * 검색 결과 페이지의 주요 컴포넌트로, 다음 하위 컴포넌트들을 통합합니다:
 * - 검색 쿼리 수정을 위한 검색 바
 * - 쿼리 정보와 카테고리가 포함된 검색 헤더
 * - 검색 트렌드 분석 그래프
 * - 관련 키워드 제안
 * - CTR 분석 섹션
 *
 * 데이터 흐름:
 * 1. URL 매개변수에서 검색 쿼리를 추출합니다
 * 2. 쿼리를 기반으로 데이터를 가져오거나 모의 데이터를 생성합니다
 * 3. 적절한 데이터를 하위 컴포넌트에 전달합니다
 *
 * 구현 참고사항:
 * 이 컴포넌트는 오케스트레이터 역할을 하며 검색 결과의 모든 기능을 통합합니다.
 * 실제 환경에서는 API 호출과 하위 컴포넌트에 데이터 분배를 조정합니다.
 */

"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SearchHeader from "./search-header"
import SearchGraph from "./search-graph"
import SearchBar from "./search-bar"
import { generateMockData } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function SearchResults() {
  // URL 매개변수에서 검색 쿼리 추출
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || "스마트폰 액세서리"
  const router = useRouter()

  // 검색 데이터와 로딩 상태를 위한 상태
  const [searchData, setSearchData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

    /**
   * 검색 데이터 가져오기 로직
   * 
   * 이 부분은 기존의 모의 데이터(mock-data) 대신 실제 API 호출을 사용하도록 수정합니다.
   * useEffect 훅은 컴포넌트가 마운트되거나 query가 변경될 때 실행됩니다.
   */
  useEffect(() => {
    // 비동기 데이터 가져오기 함수 정의
    const fetchSearchData = async () => {
      // 로딩 상태 시작
      setIsLoading(true);
      
      try {
        // 1. 기본 검색 데이터 가져오기 (월간 검색량, 상품 수, 카테고리 정보)
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        // 오류 처리
        if (!response.ok) throw new Error('검색 데이터를 가져오는데 실패했습니다');
        
        // JSON 형식으로 응답 파싱
        const data = await response.json();
        
        // 2. CTR 데이터 가져오기 (기기별, 성별, 연령대별, 요일별 CTR)
        const ctrResponse = await fetch(`/api/search/ctr?q=${encodeURIComponent(query)}`);
        
        // 오류 처리
        if (!ctrResponse.ok) throw new Error('CTR 데이터를 가져오는데 실패했습니다');
        
        // JSON 형식으로 응답 파싱
        const ctrData = await ctrResponse.json();
        
        // 3. 트렌드 데이터 가져오기 (시간별 검색량)
        const trendData = await fetchSearchTrends();
        
        // 4. 모든 데이터 통합하여 상태 업데이트
        setSearchData({
          ...data,
          ctrByDevice: ctrData.byDevice,
          ctrByGender: ctrData.byGender,
          ctrByAge: ctrData.byAge,
          ctrByWeekday: ctrData.byWeekday,
          searchTrends: trendData
        });
      } catch (error) {
        // 오류 로깅
        console.error('데이터 가져오기 오류:', error);
        
        // 여기에 오류 상태 처리 로직 추가 가능
        // 예: setErrorState(true);
      } finally {
        // 로딩 상태 종료 (성공/실패 여부와 관계없이)
        setIsLoading(false);
      }
    };
    
    /**
     * 트렌드 데이터 가져오기 함수
     * 기본적으로 최근 1년간의 주별 데이터를 가져옵니다
     */
    const fetchSearchTrends = async () => {
      // 현재 날짜와 1년 전 날짜 계산
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      
      // 트렌드 API 호출
      const response = await fetch(
        `/api/search/trends?q=${encodeURIComponent(query)}&timeFrame=weekly&dateFrom=${oneYearAgo.toISOString().split('T')[0]}&dateTo=${now.toISOString().split('T')[0]}`
      );
      
      // 오류 처리
      if (!response.ok) throw new Error('트렌드 데이터를 가져오는데 실패했습니다');
      
      // JSON 형식으로 응답 파싱하여 반환
      return await response.json();
    };
    
    // 함수 실행
    fetchSearchData();
    
    // 의존성 배열: query가 변경될 때마다 이 로직 실행
  }, [query]);

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      {/* 
        상단의 검색 바
        사용자가 검색 쿼리를 수정할 수 있게 합니다
      */}
      <SearchBar initialQuery={query} />

      {/* 
        검색 헤더 섹션
        쿼리 정보, 카테고리 및 주요 지표를 표시합니다
      */}
      <SearchHeader
        query={query}
        monthlySearches={searchData.monthlySearches}
        productsFound={searchData.productsFound}
      />

      {/* 
        관련 키워드가 포함된 검색 트렌드 분석 섹션
        왼쪽에 그래프, 오른쪽에 관련 키워드가 있는 2열 레이아웃
      */}
      <div className="mt-8 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 
          검색 트렌드 분석 그래프 - 큰 화면에서 너비의 2/3를 차지합니다
          검색 볼륨 트렌드의 대화형 시각화를 표시합니다
        */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>검색 트렌드 분석</CardTitle>
            <CardDescription>
              시간에 따른 검색량 트렌드를 시각화합니다. 그래프 위에 마우스를 올리면 상세 데이터를 볼 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="w-full h-[450px]">
              <SearchGraph data={searchData.searchTrends} />
            </div>
          </CardContent>
        </Card>

        {/* 
          관련 키워드 카드 - 큰 화면에서 너비의 1/3을 차지합니다
          현재 검색 쿼리와 관련된 키워드를 열 기반 레이아웃으로 표시합니다
          
          구현 참고사항:
          이 컴포넌트는 더 많은 키워드를 컴팩트한 공간에 표시하기 위해 
          더 효율적인 열 기반 레이아웃을 사용합니다. 현대적인 스크롤 디자인이 
          사용자 경험을 향상시킵니다.
        */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">관련 키워드</CardTitle>
              <CardDescription>다른 관련 검색어 찾기</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* 열 헤더 */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
                <div className="col-span-5">키워드</div>
                <div className="col-span-3 text-right">검색량</div>
                <div className="col-span-2 text-right">상품수</div>
                <div className="col-span-2 text-right">관련성</div>
              </div>

              {/* 스크롤 가능한 콘텐츠 영역 */}
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {/* 모의 관련 키워드 생성 */}
                {Array.from({ length: 12 }).map((_, index) => {
                  // 모의 데이터 생성
                  const keyword =
                    index % 3 === 0 ? `${query} 온라인` : index % 3 === 1 ? `최고의 ${query}` : `저렴한 ${query}`
                  const volume = Math.floor(Math.random() * 15000) + 1000
                  const products = Math.floor(Math.random() * 200) + 10
                  const relevance = Math.random() > 0.3

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                      onClick={() => {
                        // 이 키워드에 대한 검색 결과로 이동
                        router.push(`/search-results?q=${encodeURIComponent(keyword)}`)
                      }}
                    >
                      <div className="col-span-5 font-medium text-blue-600 truncate">{keyword}</div>
                      <div className="col-span-3 text-right">{volume.toLocaleString()}</div>
                      <div className="col-span-2 text-right">{products}</div>
                      <div className="col-span-2 text-right">
                        {relevance ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="높은 관련성"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-300" title="낮은 관련성"></span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 
        CTR 분석 섹션
        다양한 인구통계학적 요소별 클릭률 종합 분석
        
        구현 참고사항:
        이 섹션은 그래프가 주요 요점 섹션과 겹치는 레이아웃 문제를 해결하기 위해 
        재설계되었습니다. 각 하위 섹션은 이제 오버플로우를 방지하기 위한 
        적절한 간격과 고정 높이를 가집니다.
      */}
      <div className="mt-16 pt-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>클릭률(CTR) 분석</CardTitle>
            <CardDescription>인구통계 및 요소별 CTR 종합 분석</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            {/* 네 가지 데이터 유형에 대한 그리드 레이아웃 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 
                기기 섹션
                기기 유형별 CTR 분포를 보여줍니다
              */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기기별 분포</h3>
                <div className="space-y-4">
                  {searchData.ctrByDevice.map((item, index) => {
                    // 총계 기준 백분율 계산
                    const totalCTR = searchData.ctrByDevice.reduce((sum, i) => sum + i.ctr, 0)
                    const percentage = Math.round((item.ctr / totalCTR) * 100)

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.device}</span>
                          <span className="text-blue-600 font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* 
                  적절한 간격이 있는 주요 요점 섹션
                  기기 분포 데이터를 기반으로 인사이트 제공
                */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-2">주요 요점</h4>
                  <p className="text-sm text-gray-600">
                    {searchData.ctrByDevice[0].ctr > searchData.ctrByDevice[1].ctr
                      ? `${searchData.ctrByDevice[0].device} 사용자가 더 높은 참여도를 보입니다. 더 나은 결과를 위해 모바일 경험을 최적화하세요.`
                      : `${searchData.ctrByDevice[1].device} 사용자가 더 높은 참여도를 보입니다. 전환율을 높이기 위해 데스크톱 사이트를 최적화하세요.`}
                  </p>
                </div>
              </div>

              {/* 
                성별 섹션
                성별별 CTR 분포를 보여줍니다
              */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">성별 분포</h3>
                <div className="space-y-4">
                  {searchData.ctrByGender.map((item, index) => {
                    // 총계 기준 백분율 계산
                    const totalCTR = searchData.ctrByGender.reduce((sum, i) => sum + i.ctr, 0)
                    const percentage = Math.round((item.ctr / totalCTR) * 100)
                    const colors = ["#3b82f6", "#ec4899"]

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.gender}</span>
                          <span className="font-bold" style={{ color: colors[index % colors.length] }}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: colors[index % colors.length],
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* 
                  적절한 간격이 있는 주요 요점 섹션
                  성별 분포 데이터를 기반으로 인사이트 제공
                */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-2">주요 요점</h4>
                  <p className="text-sm text-gray-600">
                    {searchData.ctrByGender[0].value > searchData.ctrByGender[1].value
                      ? `${searchData.ctrByGender[0].gender} 사용자가 ${searchData.ctrByGender[0].value - searchData.ctrByGender[1].value}% 더 높은 참여도를 보입니다. 마케팅에서 이 인구통계를 타겟팅하는 것을 고려하세요.`
                      : `${searchData.ctrByGender[1].gender} 사용자가 ${searchData.ctrByGender[1].value - searchData.ctrByGender[0].value}% 더 높은 참여도를 보입니다. 마케팅에서 이 인구통계를 타겟팅하는 것을 고려하세요.`}
                  </p>
                </div>
              </div>

              {/* 
                연령대 섹션
                막대 차트를 사용하여 연령대별 CTR 분포를 보여줍니다
                
                구현 참고사항:
                고정 높이 컨테이너는 오버플로우를 방지하고
                차트와 주요 요점 섹션 사이에 적절한 간격을 보장합니다.
              */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">연령대별 분포</h3>
                {/* 오버플로우를 방지하기 위한 고정 높이 컨테이너 */}
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={searchData.ctrByAge.map((item) => {
                        const totalCTR = searchData.ctrByAge.reduce((sum, i) => sum + i.ctr, 0)
                        return {
                          ...item,
                          percentage: Math.round((item.ctr / totalCTR) * 100),
                        }
                      })}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "백분율"]}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      />
                      <Bar dataKey="percentage" name="백분율" fill="#3b82f6" barSize={30} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* 
                  적절한 간격이 있는 주요 요점 섹션
                  연령대별 분포 데이터를 기반으로 인사이트 제공
                */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-2">주요 요점</h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const maxCtr = Math.max(...searchData.ctrByAge.map((item) => item.ctr))
                      const topAgeGroup = searchData.ctrByAge.find((item) => item.ctr === maxCtr)?.age
                      return `${topAgeGroup} 연령대가 가장 높은 참여도를 보입니다. 이 인구통계에 맞게 콘텐츠를 조정하는 것을 고려하세요.`
                    })()}
                  </p>
                </div>
              </div>

              {/* 
                요일별 섹션
                막대 차트를 사용하여 요일별 CTR 분포를 보여줍니다
                
                구현 참고사항:
                고정 높이 컨테이너는 오버플로우를 방지하고
                차트와 주요 요점 섹션 사이에 적절한 간격을 보장합니다.
              */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">요일별 분포</h3>
                {/* 오버플로우를 방지하기 위한 고정 높이 컨테이너 */}
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={searchData.ctrByWeekday.map((item) => {
                        const totalCTR = searchData.ctrByWeekday.reduce((sum, i) => sum + i.ctr, 0)
                        return {
                          ...item,
                          percentage: Math.round((item.ctr / totalCTR) * 100),
                        }
                      })}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "백분율"]}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      />
                      <Bar dataKey="percentage" name="백분율" barSize={30} radius={[4, 4, 0, 0]}>
                        {searchData.ctrByWeekday.map((entry, index) => {
                          const maxCtr = Math.max(...searchData.ctrByWeekday.map((item) => item.ctr))
                          const topDay = searchData.ctrByWeekday.find((item) => item.ctr === maxCtr)?.day
                          return <Cell key={`cell-${index}`} fill={entry.day === topDay ? "#3b82f6" : "#93c5fd"} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* 
                  적절한 간격이 있는 주요 요점 섹션
                  요일별 분포 데이터를 기반으로 인사이트 제공
                */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-2">주요 요점</h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const maxCtr = Math.max(...searchData.ctrByWeekday.map((item) => item.ctr))
                      const topDay = searchData.ctrByWeekday.find((item) => item.ctr === maxCtr)?.day
                      return `${topDay}요일이 가장 높은 참여도를 보입니다. 최대 효과를 위해 이 날에 프로모션과 콘텐츠 출시를 예약하는 것을 고려하세요.`
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
      }
    `}</style>
    </div>
  )
}

