import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { TrendingUp, Heart, Palette, Target } from "lucide-react";

interface StyleInsightsData {
  mostViewedStyles: { style: string; count: number }[];
  favoriteColors: { color: string; count: number }[];
  averageConfidence: number;
  totalOutfits: number;
  likedStylesCount: number;
}

export const StyleInsights = () => {
  const { getStyleInsights } = useAnalytics();
  const [insights, setInsights] = useState<StyleInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getStyleInsights();
      setInsights(data);
      setLoading(false);
    };

    fetchInsights();
  }, [getStyleInsights]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Style Insights</CardTitle>
          <CardDescription>
            Generate some outfits to see your style analytics!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outfits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalOutfits}</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liked Styles</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.likedStylesCount}</div>
            <p className="text-xs text-muted-foreground">
              Outfits you loved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(insights.averageConfidence)}%
            </div>
            <Progress 
              value={insights.averageConfidence} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Style Variety</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.mostViewedStyles.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different style types
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Styles</CardTitle>
            <CardDescription>
              Your most generated outfit styles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.mostViewedStyles.map(({ style, count }, index) => (
              <div key={style} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="capitalize">
                    {style}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {count} times
                  </span>
                </div>
                <div className="text-sm font-medium">#{index + 1}</div>
              </div>
            ))}
            {insights.mostViewedStyles.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No style data available yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Colors</CardTitle>
            <CardDescription>
              Colors that appear most in your outfits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {insights.favoriteColors.slice(0, 8).map(({ color, count }) => (
                <div
                  key={color}
                  className="aspect-square rounded-lg border border-border/50 flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: color }}
                  title={`${color} - ${count} times`}
                >
                  {count}
                </div>
              ))}
              {insights.favoriteColors.length === 0 && (
                <div className="col-span-4 text-sm text-muted-foreground">
                  No color data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};