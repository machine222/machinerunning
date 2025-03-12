import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface GenderBreakdownProps {
  data: Array<{
    gender: string
    ctr: number
    value: number
  }>
}

export default function GenderBreakdown({ data }: GenderBreakdownProps) {
  const COLORS = ["#3b82f6", "#ec4899"]

  // Ensure values sum to 100%
  const totalValue = data.reduce((sum, item) => sum + item.ctr, 0)
  const normalizedData = data.map((item) => ({
    ...item,
    value: Math.round((item.ctr / totalValue) * 100),
  }))

  // Verify the sum is 100%
  const sum = normalizedData.reduce((sum, item) => sum + item.value, 0)
  // If not exactly 100 due to rounding, adjust the largest value
  if (sum !== 100) {
    const diff = 100 - sum
    const largestIdx = normalizedData[0].value > normalizedData[1].value ? 0 : 1
    normalizedData[largestIdx].value += diff
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 overflow-hidden">
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={normalizedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {normalizedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                  labelFormatter={(index) => normalizedData[index].gender}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <div className="space-y-4">
            {normalizedData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.gender}</span>
                  <span className="font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium mb-2">Key Takeaway</h4>
            <p className="text-sm text-gray-600">
              {normalizedData[0].value > normalizedData[1].value
                ? `${normalizedData[0].gender} users make up ${normalizedData[0].value}% of your audience. Consider targeting this demographic in your marketing.`
                : `${normalizedData[1].gender} users make up ${normalizedData[1].value}% of your audience. Consider targeting this demographic in your marketing.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

