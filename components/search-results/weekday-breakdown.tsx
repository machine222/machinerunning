import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface WeekdayBreakdownProps {
  data: Array<{
    day: string
    ctr: number
  }>
}

export default function WeekdayBreakdown({ data }: WeekdayBreakdownProps) {
  // Calculate total CTR to normalize percentages
  const totalCTR = data.reduce((sum, item) => sum + item.ctr, 0)

  // Create normalized data where percentages sum to 100%
  const normalizedData = data.map((item) => ({
    ...item,
    percentage: Math.round((item.ctr / totalCTR) * 100),
  }))

  // Ensure percentages sum to exactly 100%
  const sum = normalizedData.reduce((sum, item) => sum + item.percentage, 0)
  if (sum !== 100) {
    // Find the item with the highest percentage to adjust
    let maxIdx = 0
    let maxVal = normalizedData[0].percentage
    for (let i = 1; i < normalizedData.length; i++) {
      if (normalizedData[i].percentage > maxVal) {
        maxVal = normalizedData[i].percentage
        maxIdx = i
      }
    }
    normalizedData[maxIdx].percentage += 100 - sum
  }

  // Find the day with the highest percentage
  const maxPercentage = Math.max(...normalizedData.map((item) => item.percentage))
  const topDay = normalizedData.find((item) => item.percentage === maxPercentage)?.day

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 overflow-hidden">
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{
                percentage: {
                  label: "Percentage (%)",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={normalizedData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="percentage" barSize={40} radius={[4, 4, 0, 0]}>
                    {normalizedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.day === topDay ? "#3b82f6" : "#93c5fd"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Day of Week Distribution</h3>
          <div className="space-y-4">
            {normalizedData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.day}</span>
                  <span className={`font-bold ${item.day === topDay ? "text-blue-600" : "text-gray-700"}`}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${item.day === topDay ? "bg-blue-600" : "bg-blue-400"}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium mb-2">Key Takeaway</h4>
            <p className="text-sm text-gray-600">
              {topDay} represents {maxPercentage}% of your traffic distribution. Consider scheduling your promotions and
              content releases on this day for maximum impact.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

