
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChartBig } from 'lucide-react';
import Image from 'next/image';

export default function MarketTrendsDisplay() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          Market Trends & Insights
        </CardTitle>
        <CardDescription className="text-lg">
          Explore property price trends, demand dynamics, and neighborhood statistics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <BarChartBig className="w-24 h-24 mx-auto text-primary mb-6 opacity-50" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Advanced Charts Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We&apos;re working on bringing you detailed charts and visualizations for market trends.
            Stay tuned for insights on median prices, demand trends, and more.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Example: Price Index for "Pleasantville"</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Placeholder Price Trend Chart" 
              width={600} 
              height={300} 
              className="rounded-md shadow-md w-full md:w-2/3 object-cover"
              data-ai-hint="graph chart" 
            />
            <div className="md:w-1/3">
              <h3 className="text-lg font-semibold text-primary">5-Marla Plot Prices</h3>
              <p className="text-muted-foreground mt-1 mb-3">Average price trend over the last 12 months.</p>
              <ul className="space-y-1 text-sm">
                <li><span className="font-medium">Current Median:</span> $80,000</li>
                <li><span className="font-medium">YoY Change:</span> +5.2%</li>
                <li><span className="font-medium">Demand:</span> High</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <CardDescription className="text-center text-sm text-muted-foreground pt-4">
            Market data is illustrative. Real data and interactive charts will be available soon.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
