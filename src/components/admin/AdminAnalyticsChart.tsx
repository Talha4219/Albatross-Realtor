
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { BarChart3 } from "lucide-react"

interface AdminAnalyticsChartProps {
  data: {
    month: string;
    users: number;
    properties: number;
  }[];
}

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
  properties: {
    label: "New Properties",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AdminAnalyticsChart({ data }: AdminAnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
        <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Platform Analytics
                </CardTitle>
                <CardDescription>
                    Overview of user registrations and property listings.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-muted/30 rounded-b-lg">
                <p className="text-muted-foreground italic">
                    Not enough data to display analytics yet.
                </p>
            </CardContent>
        </Card>
    );
  }
    
  return (
     <Card className="lg:col-span-4 shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Platform Analytics
            </CardTitle>
            <CardDescription>
                New users and properties added over the last 6 months.
            </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={data} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                <Bar dataKey="properties" fill="var(--color-properties)" radius={4} />
            </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
