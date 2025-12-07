import { useState, useMemo } from "react";
import type { CoffeeTeam, SnackImpactDepartment } from "../../../../../types/mock.ts";

interface UseMultiLineChartProps {
  data: CoffeeTeam[] | SnackImpactDepartment[];
  xAxisKey: string;
  leftMetric: string;
  rightMetric: string;
}

interface TooltipData {
  x: number;
  y: number;
  team: string;
  xValue: number;
  leftValue: number;
  rightValue: number;
}

export function useMultiLineChart({ data, xAxisKey, leftMetric, rightMetric }: UseMultiLineChartProps) {
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const chartData = useMemo(() => {
    const dataMap = new Map<number, Record<string, number>>();
    data.forEach((item) => {
      const name = "team" in item ? item.team : item.name;
      const series = "series" in item ? item.series : item.metrics;

      series.forEach((point) => {
        const xValue = point[xAxisKey as keyof typeof point] as number;
        const leftValue = point[leftMetric as keyof typeof point] as number;
        const rightValue = point[rightMetric as keyof typeof point] as number;

        if (!dataMap.has(xValue)) {
          dataMap.set(xValue, { [xAxisKey]: xValue });
        }
        const entry = dataMap.get(xValue)!;
        entry[`${name}_${leftMetric}`] = leftValue;
        entry[`${name}_${rightMetric}`] = rightValue;
      });
    });
    return Array.from(dataMap.values()).sort((a, b) => a[xAxisKey] - b[xAxisKey]);
  }, [data, xAxisKey, leftMetric, rightMetric]);

  const handleDotEnter = (e: React.MouseEvent, team: string, xValue: number, leftValue: number, rightValue: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.closest(".recharts-wrapper")?.getBoundingClientRect();

    if (parent) {
      setTooltipData({
        x: rect.left - parent.left + rect.width / 2,
        y: rect.top - parent.top,
        team,
        xValue,
        leftValue,
        rightValue,
      });
    }
  };

  const handleDotLeave = () => {
    setTooltipData(null);
    setHoveredDot(null);
  };

  return {
    hoveredDot,
    setHoveredDot,
    tooltipData,
    chartData,
    handleDotEnter,
    handleDotLeave,
  };
}
