import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DeviceBreakdownProps {
  data: Array<{
    device: string
    ctr: number
  }>
}

export default function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  // Calculate total CTR to normalize percentages
  const totalCTR = data.reduce((sum, item) => sum + item.ctr, 0)

  // Create normalized data where percentages sum to 100%
  const normalizedData = data.map((item) => ({
    ...item,
    percentage: Math.round((item.ctr / totalCTR) * 100),
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 overflow-hidden">
        <CardContent className="p-6">
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{
                ctr: {
                  label: "Click-Through Rate (%)",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ctr" fill="var(--color-ctr)" barSize={60}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#3b82f6" : "#60a5fa"} />
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
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="space-y-4">
            {normalizedData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.device}</span>
                  <span className="text-blue-600 font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium mb-2">Key Takeaway</h4>
            <p className="text-sm text-gray-600">
              {normalizedData[0].percentage > normalizedData[1].percentage
                ? `${normalizedData[0].device} users represent ${normalizedData[0].percentage}% of your audience. Optimize your ${normalizedData[0].device.toLowerCase()} experience for better results.`
                : `${normalizedData[1].device} users represent ${normalizedData[1].percentage}% of your audience. Ensure your ${normalizedData[1].device.toLowerCase()} site is optimized for conversions.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

