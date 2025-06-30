
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import type { Property } from "@/types"
import { BarChart3 } from "lucide-react"

interface AgentAnalyticsChartProps {
  data: Property[];
}

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function AgentAnalyticsChart({ data }: AgentAnalyticsChartProps) {
    if (!data || data.length === 0) {
        return (
             <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Listing Performance
                  </CardTitle>
                  <CardDescription>Overview of your listing performance.</CardDescription>
                </CardHeader>
                <CardContent className="h-40 flex items-center justify-center bg-muted/30 rounded-b-lg">
                    <p className="text-muted-foreground italic">
                        No properties listed yet to show analytics.
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    const chartData = data.map(prop => ({
        name: prop.address.split(',')[0], // Use first part of address as name
        views: prop.views || 0,
    })).slice(0, 10); // Show top 10 properties by submission date

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Listing Performance
        </CardTitle>
        <CardDescription>Total views for your most recent listings.</CardDescription>
      </CardHeader>
      <CardContent className="h-40">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="views" fill="var(--color-views)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
