/**
 * SearchGraph 컴포넌트
 *
 * 목적:
 * 특정 키워드에 대한 시간 경과에 따른 검색량 트렌드를 시각화합니다.
 * 사용자가 데이터를 자세히 탐색할 수 있는 대화형 기능을 제공합니다.
 *
 * 데이터 소스:
 * 현재는 데모 목적으로 모의 데이터를 사용합니다.
 * 실제 환경에서는 지정된 키워드에 대한 과거 검색량 데이터를 반환하는
 * API에서 데이터를 가져올 것입니다.
 *
 * 기능:
 * - 대화형 시간 주기 선택(일별, 주별, 월별)
 * - 날짜 범위 필터링 옵션
 * - 캘린더를 통한 사용자 지정 날짜 범위 선택
 * - 상세 데이터 포인트를 보여주는 대화형 호버 효과
 *
 * 구현 참고사항:
 * 이 컴포넌트는 실제 데이터로 대화형 그래프가 어떻게 작동할지 보여주는
 * 데모 컴포넌트입니다. 호버 효과와 툴팁은 완전히 기능하지만 모의 데이터로 작동합니다.
 */

"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Rectangle } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface SearchGraphProps {
  data: {
    daily: Array<{ date: string; searches: number }>
    weekly: Array<{ date: string; searches: number }>
    monthly: Array<{ date: string; searches: number }>
  }
}

/**
 * CustomTooltip 컴포넌트
 *
 * 목적:
 * 그래프의 데이터 포인트 위에 마우스를 올렸을 때 자세한 정보를 표시합니다.
 * 스타일이 지정된 직사각형 상자에 정확한 날짜와 검색량을 표시합니다.
 *
 * 구현 참고사항:
 * 이 기능은 호버 시 정확한 데이터 값을 제공하여 사용자 경험을 향상시킵니다.
 * 실제 환경에서는 추가 지표나 비교 데이터를 표시하도록 확장할 수 있습니다.
 */
// const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//     const date = new Date(label)
//     return (
//       <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
//         <p className="font-medium text-gray-900 mb-1">{format(date, "MMMM d, yyyy")}</p>
//         <p className="text-blue-600 font-bold text-lg">{payload[0].value?.toLocaleString()} 검색</p>
//       </div>
//     )
//   }
//   return null
// }

/**
 * CustomizedDot 컴포넌트
 *
 * 목적:
 * 호버 시 데이터 포인트의 시각적 모양을 향상시킵니다.
 * 선택한 데이터 포인트의 더 두드러진 표시기를 생성합니다.
 *
 * 구현 참고사항:
 * 이는 대화형 경험을 향상시키는 UI 개선입니다.
 * 색상이 지정된 테두리가 있는 흰색 채워진 원은 어떤 데이터 포인트가
 * 검사되고 있는지 명확한 시각적 표시기를 생성합니다.
 */
const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props
  return <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={2} fill="white" />
}

/**
 * CustomCursor 컴포넌트
 *
 * 목적:
 * 그래프 위에 마우스를 올렸을 때 강조 표시된 직사각형 영역을 생성합니다.
 * 사용자가 어떤 시간 주기를 검사하고 있는지 시각적으로 식별하는 데 도움이 됩니다.
 *
 * 구현 참고사항:
 * 이는 대화형 경험을 향상시키는 데모 기능입니다.
 * 반투명 파란색 직사각형은 선택한 시간 주기에 대한 명확한 시각적 피드백을 제공합니다.
 */
const CustomCursor = (props: any) => {
  const { x, y, width, height, stroke } = props
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(59, 130, 246, 0.1)"
      stroke="rgba(59, 130, 246, 0.5)"
      strokeWidth={1}
    />
  )
}

export default function SearchGraph({ data }: SearchGraphProps) {
  // 시간 프레임 보기(일별, 주별, 월별)를 제어하는 상태
  const [timeFrame, setTimeFrame] = useState("weekly")

  // 날짜 범위 필터를 제어하는 상태
  const [dateRange, setDateRange] = useState("1year")

  // 사용자 지정 날짜 범위 선택을 위한 상태
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 기본값: 1년 전
  )
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(new Date())
  const [customDateOpen, setCustomDateOpen] = useState(false)

  /**
   * getFilteredData 함수
   *
   * 목적:
   * 선택한 시간 프레임과 날짜 범위에 따라 데이터를 필터링합니다.
   *
   * 구현 참고사항:
   * 이 함수는 표시할 데이터를 필터링하기 위한 모든 로직을 처리합니다.
   * 미리 정의된 날짜 범위와 사용자 지정 날짜 선택을 모두 지원합니다.
   * 실제 환경에서는 성능을 최적화하기 위해 특정 날짜 범위에 대한 데이터를
   * 가져오는 API 호출로 대체될 수 있습니다.
   *
   * @returns {Array} - 선택한 기준에 따라 필터링된 데이터 배열
   */
  const getFilteredData = () => {
    const currentData = data[timeFrame as keyof typeof data]

    // 사용자 지정 날짜 범위 선택 처리
    if (dateRange === "custom" && customDateFrom && customDateTo) {
      const fromTimestamp = customDateFrom.getTime()
      const toTimestamp = customDateTo.getTime()

      return currentData.filter((item) => {
        const itemDate = new Date(item.date).getTime()
        return itemDate >= fromTimestamp && itemDate <= toTimestamp
      })
    }

    // 미리 정의된 날짜 범위 처리
    const now = new Date()
    let fromDate = new Date()

    switch (dateRange) {
      case "3years":
        fromDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate())
        break
      case "1year":
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case "1month":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      default:
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    }

    return currentData.filter((item) => new Date(item.date) >= fromDate)
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-4">
      {/* 
        시간 프레임 및 날짜 범위 컨트롤
        이 컨트롤을 통해 사용자는 검색 트렌드 데이터 보기를 조정할 수 있습니다
      */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* 
          시간 프레임 선택 탭
          일별, 주별, 월별 보기 간 전환 가능
        */}
        <Tabs value={timeFrame} onValueChange={setTimeFrame} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="daily">일별</TabsTrigger>
            <TabsTrigger value="weekly">주별</TabsTrigger>
            <TabsTrigger value="monthly">월별</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 
          날짜 범위 선택 버튼
          다양한 시간 주기로 데이터 필터링 가능
        */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={dateRange === "3years" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("3years")}
          >
            최근 3년
          </Button>
          <Button
            variant={dateRange === "1year" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("1year")}
          >
            최근 1년
          </Button>
          <Button
            variant={dateRange === "1month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("1month")}
          >
            최근 1개월
          </Button>

          {/* 
            사용자 지정 날짜 범위 선택기
            사용자가 특정 시작 및 종료 날짜를 선택할 수 있습니다
          */}
          <Popover open={customDateOpen} onOpenChange={setCustomDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={dateRange === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("custom")}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {dateRange === "custom" && customDateFrom && customDateTo
                  ? `${format(customDateFrom, "yyyy년 M월 d일")} - ${format(customDateTo, "yyyy년 M월 d일")}`
                  : "사용자 지정 범위"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Card>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="border-r">
                      <Calendar
                        mode="single"
                        selected={customDateFrom}
                        onSelect={setCustomDateFrom}
                        disabled={(date) => date > new Date() || (customDateTo ? date > customDateTo : false)}
                        initialFocus
                      />
                    </div>
                    <div>
                      <Calendar
                        mode="single"
                        selected={customDateTo}
                        onSelect={setCustomDateTo}
                        disabled={(date) => date > new Date() || (customDateFrom ? date < customDateFrom : false)}
                        initialFocus
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 p-3 border-t">
                    <Button variant="outline" size="sm" onClick={() => setCustomDateOpen(false)}>
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setDateRange("custom")
                        setCustomDateOpen(false)
                      }}
                    >
                      적용
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 
        대화형 검색 트렌드 그래프
        대화형 호버 효과가 있는 시간 경과에 따른 검색량 트렌드 표시
        
        구현 참고사항:
        이는 사용자가 그래프와 어떻게 상호 작용할지 보여주는 데모 기능입니다.
        호버 효과는 특정 데이터 포인트에 대한 자세한 정보를 보여주어
        사용자가 트렌드를 분석하는 능력을 향상시킵니다.
      */}
      <div className="w-full h-[400px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                if (timeFrame === "daily") return format(date, "M월 d일")
                if (timeFrame === "weekly") return format(date, "M월 d일")
                return format(date, "yyyy년 M월")
              }}
              height={30}
              tick={{ fontSize: 12 }}
            />
            <YAxis width={60} tickFormatter={(value) => value.toLocaleString()} />
            <Tooltip
              formatter={(value) => [`${value.toLocaleString()} 검색`, "검색량"]}
              labelFormatter={(label) => {
                const date = new Date(label)
                return format(date, "yyyy년 M월 d일")
              }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "0.375rem",
                padding: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              active={true}
            />
            <Line
              type="monotone"
              dataKey="searches"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

