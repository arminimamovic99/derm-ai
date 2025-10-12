"use client"

import { Info, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export const description = "A line chart with a label"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ProgressChartProps {
    chartData: {score: number, date: string}[]; 
}

export function ProgressChart({chartData}: ProgressChartProps) {
  return (
    <div className="relative z-10 w-[100%] h-[400px] mt-6">
        <div className="flex items-center gap-2 mb-5">
            <Popover>
                <PopoverTrigger><Info /></PopoverTrigger>
                <PopoverContent>
                    Your progress chart shows how your skin health score has changed over time.
                    Each point represents an analysis you’ve completed, helping you see trends and improvements in your skin’s condition.
                </PopoverContent>
            </Popover>
            <h2 className='text-2xl font-semibold'>Your skin health progress over time</h2>
        </div>
        <Card className="shadow-md border-none rounded-lg bg-[#f8f7f4] mb-10">
            <CardHeader>
                <CardDescription>
                    { chartData[chartData.length - 1]?.date } - { chartData[0]?.date }
                </CardDescription>
            </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                top: 20,
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                dataKey="score"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                    fill: "var(--color-desktop)",
                }}
                activeDot={{
                    r: 6,
                }}
                >
                <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                />
                </Line>
            </LineChart>
            </ChartContainer>
        </CardContent>
        </Card>

    </div>
  )
}
